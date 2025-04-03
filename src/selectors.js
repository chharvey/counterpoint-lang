import {
	lookaheads,
	lookbehinds,
} from './helpers.js';



export const DELIMS = {
	GROUPING:    ['\\(', '\\)'],
	LIST:        ['\\[', '\\]'],
	SET:         ['\\{', `\\}${ lookaheads(['\\}'], true) }`],
	ARGS_GN:     ['<',   '>'],
	ARGS_FN:     ['\\(', '\\)'],
	ACCESS_SING: ['\\[', '\\]'],
	ACCESS_MULT: ['\\{', '\\}'],
	CLAIM:       ['<',   '>'],
	BLOCK:       ['\\{', `\\}${ lookaheads(['\\}'], true) }`],
	CAPTURES:    ['\\[', '\\]'],
	PARAMS_GN:   ['<',   '>'],
	PARAMS_FN:   ['\\(', '\\)'],
	DESTRUCT:    ['\\[', '\\]'],
};

export const OWS = '(?:\\s+|(%%(?:%?[^%])*%%))*';
export const INT = '(?:\\+|-)?(?:\\\\[bqodxz])?[0-9a-z_]+';
export const VAR = '(?:\\b[A-Za-z_][A-Za-z0-9_]*\\b|\'.*\')';

export const COMP_ACCESS = '\\b(public|secret|private)\\b';
export const MEMB_ACCESS = `\\b(${ COMP_ACCESS }|protected)\\b`;
export const UNFIXED    = '\\b(var)\\b';
export const NOMINAL    = '\\b(nominal)\\b';
export const MUTABLE    = '\\b(mut)\\b';
export const ALIAS      = '\\b(as)\\b';
export const PUN        = '\\$';
export const VARIANCE   = '\\b(out|in)\\b';
export const CONSTRAINT = '\\b(narrows|widens)\\b'
export const PERMISSION = '\\b(const|readonly|writeonly)\\b';
export const IMPL       = '\\b(override|impl)\\b';
export const IMPL_CLAIM = '\\b(override|impl|claim)\\b';
export const ANNO_START = `\\??\\:${ lookaheads(['\\:'], true) }`;
export const ASSN_START = `=${ lookaheads(['=', '>'], true) }`;
export const DFLT_START = `\\?${ ASSN_START }`;
export const THINARROW  = '->';
export const FATARROW   = '=>';
export const BLOCK_END  = '\\}'; // used for lookbehinds (cannot contain lookaheads)

function destructure_selector(prop_delim) {
	return `
		(?<DestructurePropertiesOrArguments>${ DELIMS.DESTRUCT[0] }${ OWS }
			(?<DestructurePropertyOrArgumentItemOrKey>
				(?<DestructurePropertyOrArgumentItem>
					${ VAR }
					| \\g<DestructurePropertiesOrArguments>
				)
				| (?<DestructurePropertyOrArgumentKey>
					${ VAR } ${ OWS } ${ PUN }
					| ${ VAR } ${ OWS } ${ prop_delim } ${ OWS } \\g<DestructurePropertyOrArgumentItem>
				)
			)
			(?:${ OWS },${ OWS }\\g<DestructurePropertyOrArgumentItemOrKey>)*
			${ OWS },?
		${ OWS }${ DELIMS.DESTRUCT[1] })
	`.replace(/\s+/g, '');
}

export const DESTRUCTURE_TYPE_PROPERTIES_OR_GENERIC_ARGUMENTS = destructure_selector(ANNO_START);
export const DESTRUCTURE_PROPERTIES_OR_ARGUMENTS              = destructure_selector(ASSN_START);

export const DESTRUCTURE_ASSIGNEES = `
	(?<DestructureAssignees>${ DELIMS.DESTRUCT[0] }${ OWS }
		(?<DestructureAssigneeItemOrKey>
			(?<DestructureAssigneeItem>
				(?<Assignee> ${ VAR }${ OWS }(?:\\.${ OWS }(?:
					${ INT }
					| ${ VAR }
					| (?:${ DELIMS.LIST[0] })(?: ${ OWS } | .* )${ DELIMS.LIST[1] }
				)${ OWS })*)
				| \\g<DestructureAssignees>
			)
			| (?<DestructureAssigneeKey>
				${ VAR } ${ OWS } ${ PUN }
				| ${ VAR } ${ OWS } ${ ASSN_START } ${ OWS } \\g<DestructureAssigneeItem>
			)
		)
		(?:${ OWS },${ OWS }\\g<DestructureAssigneeItemOrKey>)*
		${ OWS },?
	${ OWS }${ DELIMS.DESTRUCT[1] })
`.replace(/\s+/g, '');

export const FUNCTIONTYPE = `
	${ DELIMS.PARAMS_GN[0] } # any generic parameters
	| ${ DELIMS.PARAMS_FN[0] }${ OWS }(?:
		${ DELIMS.PARAMS_FN[1] }${ OWS }(?<aftertypeparams> ${ FATARROW }) # exactly 0 type parameters
		| ${ ANNO_START }                                                  # annotated unnamed type parameter
		| ${ VAR }${ OWS }(?:
			${ DELIMS.PARAMS_FN[1] }${ OWS }\\g<aftertypeparams> # exactly 1 unnamed type parameter
			| ${ ANNO_START } | ,                                # annotated named type parameter, or more than 1 type parameter
		)
	)
`.replace(/\#.*\n|\s+/g, '');

export const FUNCTION = `
	(?:
		(?<aftergenericparams>
			(?: # captures
				${ DELIMS.CAPTURES[0] }${ OWS }
					(?:${ UNFIXED }${ OWS })?${ VAR }
					(?:${ OWS },${ OWS }(?:${ UNFIXED }${ OWS })?${ VAR })*
					${ OWS },?
				${ OWS }${ DELIMS.CAPTURES[1] }
			)?
			${ DELIMS.PARAMS_FN[0] }${ OWS }(?:
				${ DELIMS.PARAMS_FN[1] }${ OWS }(?<afterparams> ${ ANNO_START } | ${ FATARROW } | ${ DELIMS.BLOCK[0] }) # exactly 0 parameters
				| ${ UNFIXED }
				| ${ VAR }${ OWS }(?:
					${ DELIMS.PARAMS_FN[1] }${ OWS }\\g<afterparams>          # exactly 1 unaliased unannotated uninitialized nondestructued parameter
					| ${ ASSN_START } | ${ ANNO_START } | ${ DFLT_START } | , # aliased, annotated, or initialized, or more than 1 parameter
				)
			)
		)
		| ${ DELIMS.PARAMS_GN[0] }${ OWS }(?:
			${ MUTABLE }
			| ${ VARIANCE }
			| ${ OWS }${ VAR }${ OWS }(?:
				${ DELIMS.PARAMS_GN[1] }${ OWS }\\g<aftergenericparams> # exactly 1 unannotated uninitialized generic parameter
				| ${ CONSTRAINT } | ${ DFLT_START } | ,                 # annotated, or initialized, or more than 1 generic parameter
			)
		)
	)
	| ${ lookbehinds([DELIMS.PARAMS_FN[1]]) }${ OWS }\\g<afterparams>
`.replace(/\#.*\n|\s+/g, '');

export const FIELD = `
	(${ MEMB_ACCESS } ${ OWS })?
	(${ IMPL_CLAIM } ${ OWS })?
	(${ PERMISSION } ${ OWS })?
	${ VAR } ${ OWS }
	(?:${ ANNO_START } | ${ ASSN_START })
`.replace(/\s+/g, '');

export const FIELD_CONSTRUCTOR = `
	${ MEMB_ACCESS } ${ OWS }
	(${ IMPL } ${ OWS })?
	(${ PERMISSION } ${ OWS })?
	(?:
		(${ VAR } ${ OWS } ${ ASSN_START } ${ OWS })? (${ UNFIXED } ${ OWS })? ${ VAR } ${ OWS } (${ ANNO_START } | ${ DFLT_START })
		| ${ VAR } ${ OWS } ${ ASSN_START } ${ OWS } ${ DELIMS.DESTRUCT[0] }
	)
`.replace(/\s+/g, '');

export const CONSTRUCTOR = `
	(${ MEMB_ACCESS } ${ OWS })?
	(?:\\b new \\b ${ OWS })? ${ DELIMS.PARAMS_FN[0] }
`.replace(/\s+/g, '');

export const CONSTRUCTORGROUP = `
	(${ MEMB_ACCESS } ${ OWS })?
	\\b new \\b ${ OWS } ${ DELIMS.BLOCK[0] }
`.replace(/\s+/g, '');

export const METHOD = `
	(${ MEMB_ACCESS } ${ OWS })?
	(${ IMPL_CLAIM } ${ OWS })?
	(\\b final \\b ${ OWS })?
	(${ MUTABLE } ${ OWS })?
	(?:${ VAR } ${ OWS })? (?:< | ${ DELIMS.PARAMS_FN[0] })
`.replace(/\s+/g, '');

export const METHODGROUP = `
	(${ MEMB_ACCESS } ${ OWS })?
	(${ IMPL_CLAIM } ${ OWS })?
	(\\b final \\b ${ OWS })?
	${ VAR } ${ OWS } ${ DELIMS.BLOCK[0] }
`.replace(/\s+/g, '');
