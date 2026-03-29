import {lookaheads} from './helpers.ts';



export const DELIMS = {
	GROUPING:  ['\\(', '\\)'],
	LIST:      ['\\[', '\\]'],
	SET:       ['\\{', `\\}${ lookaheads(['\\}'], true) }`],
	ARGS_GN:   ['<',   '>'],
	ARGS_FN:   ['\\(', '\\)'],
	ACCESS:    ['\\[', '\\]'],
	CLAIM:     ['<',   '>'],
	BLOCK:     ['\\{', `\\}${ lookaheads(['\\}'], true) }`],
	CAPTURES:  ['\\[', '\\]'],
	PARAMS_GN: ['<',   '>'],
	PARAMS_FN: ['\\(', '\\)'],
	DESTRUCT:  ['\\(', '\\)'],
	IMPORT:    ['\\(', '\\)'],
};

export const OWS     = '(?:\\s+|(%%(?:%?[^%])*%%))*';
export const INT     = '(?:\\+|-)?(?:\\\\[bqodxz])?[0-9a-z_]+';
export const VARNAME = '\\b[A-Za-z_][A-Za-z0-9_]*\\b';
export const VAR     = `(?:${ VARNAME }|\'.*\')`;

export const COMP_ACCESS = '\\b(public|internal|private)\\b';
export const MEMB_ACCESS = `\\b(${ COMP_ACCESS }|protected)\\b`;
export const UNFIXED    = '\\b(mut)\\b';
export const REF        = '\\b(ref)\\b';
export const NOMINAL    = '\\b(nominal)\\b';
export const MUTABLE    = '\\b(mut)\\b';
export const ALIAS      = '\\b(as)\\b';
export const PUN        = '\\$';
export const OPT        = '\\?';
export const VARIANCE   = '\\b(out|in)\\b';
export const CONSTRAINT = '\\b(narrows|widens)\\b'
export const PERMISSION = '\\b(const|readonly|writeonly)\\b';
export const IMPL       = '\\b(impl)\\b';
export const OVR        = '\\b(override|impl)\\b';
export const OVR_CLAIM  = '\\b(override|impl|claim)\\b';
export const ANNO_START = `\\:${ lookaheads(['\\:'], true) }`;
export const ASSN_START = `=${ lookaheads(['[=>]'], true) }`;
export const THINARROW  = '->';
export const FATARROW   = '=>';
export const BLOCK_END  = '\\}'; // used for lookbehinds (cannot contain lookaheads)
export const DOT        = '(\\.)';
export const DOT_ACCESS = '(\\.|\\?\\.|\\!\\.)';
export const BACKSLASH  = '(\\\\)';

export function destructure_selector(prop_delim: string) {
	return `
		(?<DestructureLabels>${ DELIMS.DESTRUCT[0] }${ OWS }
			(?<DestructureLabel>
				  (${ VAR } ${ OWS } ${ prop_delim } | ${ PUN })? ${ OWS } ${ VAR }
				| (${ VAR } ${ OWS } ${ prop_delim })?            ${ OWS } \\g<DestructureLabels>
			)
			(?:${ OWS },${ OWS }\\g<DestructureLabel>)*
			${ OWS },?
		${ OWS }${ DELIMS.DESTRUCT[1] })
	`.replace(/\s+/g, '');
}

export const FIELD = `
	(${ MEMB_ACCESS } ${ OWS })?
	(${ OVR_CLAIM } ${ OWS })?
	(${ PERMISSION } ${ OWS })?
	${ VAR } ${ OWS } (${ OPT } ${ OWS })?
	(?:${ ANNO_START } | ${ ASSN_START })
`.replace(/\s+/g, '');

export const FIELD_CONSTRUCTOR = `
	${ MEMB_ACCESS } ${ OWS }
	(${ OVR } ${ OWS })?
	(${ PERMISSION } ${ OWS })?
	(?:
		(${ VAR } ${ OWS } ${ ASSN_START } ${ OWS })? (${ UNFIXED } ${ OWS })? ${ VAR } ${ OWS } (${ OPT } ${ OWS })? (${ ANNO_START } | ${ ASSN_START })
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
	(${ OVR_CLAIM } ${ OWS })?
	(\\b final \\b ${ OWS })?
	(${ MUTABLE } ${ OWS })?
	(?:${ VAR } ${ OWS })? (?:< | ${ DELIMS.PARAMS_FN[0] })
`.replace(/\s+/g, '');

export const METHODGROUP = `
	(${ MEMB_ACCESS } ${ OWS })?
	(${ OVR_CLAIM } ${ OWS })?
	(\\b final \\b ${ OWS })?
	${ VAR } ${ OWS } ${ DELIMS.BLOCK[0] }
`.replace(/\s+/g, '');
