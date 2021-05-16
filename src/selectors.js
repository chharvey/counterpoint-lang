import {
	lookaheads,
	lookbehinds,
} from './helpers.js';



export const OWS = '(?:\\s+|(%%(?:%?[^%])*%%))*';
export const INT = '(?:\\+|-)?(?:\\\\[bqodxz])?[0-9a-z_]+';
export const VAR = '(?:\\b[A-Za-z_][A-Za-z0-9_]*\\b|`.*`)';

export const ANNO_START = ':';
export const ASSN_START = `=${ lookaheads(['=', '>'], true) }`;
export const TYPEARROW  = '->';
export const ARROW      = '=>';
export const BLOCK_END  = `\\}${ lookaheads(['\\}'], true) }`;

export const DESTRUCTURE_PROPERTIES_OR_ARGUMENTS = `
	(?<DestructurePropertiesOrArguments>\\(${ OWS }
		(?<DestructurePropertyOrArgumentItemOrKey>
			(?<DestructurePropertyOrArgumentItem>
				${ VAR }
				| \\g<DestructurePropertiesOrArguments>
			)
			| (?<DestructurePropertyOrArgumentKey>
				${ VAR }${ OWS }\\$
				| ${ VAR }${ OWS } \\b as \\b ${ OWS } \\g<DestructurePropertyOrArgumentItem>
			)
		)
		(?:${ OWS },${ OWS }\\g<DestructurePropertyOrArgumentItemOrKey>)*
		${ OWS },?
	${ OWS }\\))
`.replace(/\s+/g, '');

export const DESTRUCTURE_ASSIGNEES = `
	(?<DestructureAssignees>\\(${ OWS }
		(?<DestructureAssigneeItemOrKey>
			(?<DestructureAssigneeItem>
				(?<Assignee>${ VAR }${ OWS }(?:\\.${ OWS }(?:
					${ INT }
					| ${ VAR }
					| \\[(?: ${ OWS } | .* )\\]
				)${ OWS })*)
				| \\g<DestructureAssignees>
			)
			| (?<DestructureAssigneeKey>
				${ VAR }${ OWS }\\$
				| ${ VAR }${ OWS } \\b as \\b ${ OWS } \\g<DestructureAssigneeItem>
			)
		)
		(?:${ OWS },${ OWS }\\g<DestructureAssigneeItemOrKey>)*
		${ OWS },?
	${ OWS }\\))
`.replace(/\s+/g, '');

export const FUNCTION = `
	(?:
		\\[${ OWS }
			${ VAR }
			(?:${ OWS },${ OWS }${ VAR })*
			${ OWS },?
		${ OWS }\\]
	)?
	(?:
		<${ OWS }${ VAR }${ OWS }(?:
			\\b(?:narrows | widens)\\b | ${ ASSN_START } | , # annotated, or assigned, or more than 1 generic parameter
			| >${ OWS }(?<aftertypeparams>                   # exactly 1 unannotated uninitialized generic parameter
				\\(${ OWS }${ VAR }${ OWS }(?:
					${ ANNO_START } | ${ ASSN_START } | , | \\b as \\b              # annotated, or assigned, or more than 1 parameter, or destrucured
					| \\)${ OWS }(?<afterparams>${ ANNO_START } | ${ ARROW } | \\{) # exactly 1 unannotated uninitialized nondestructued parameter
				)
				| \\(${ OWS }\\)${ OWS }\\g<afterparams> # exactly 0 parameters
			)
		)
		| \\g<aftertypeparams>
	)
	| ${ lookbehinds(['\\)']) }${ OWS }\\g<afterparams>
`.replace(/\#.*\n|\s+/g, '');

export const FIELD = `
	(\\b static \\b ${ OWS })?
	(\\b(?:public | secret | private | protected)\\b ${ OWS })?
	(\\b override \\b ${ OWS })?
	(\\b(?:final | readonly)\\b ${ OWS })?
	${ VAR } ${ OWS } ${ ANNO_START }
`.replace(/\s+/g, '');

export const FIELD_CONSTRUCTOR = `
	\\b(?:public | secret | private | protected)\\b ${ OWS }
	(\\b override \\b ${ OWS })?
	(\\b(?:final | readonly)\\b ${ OWS })?
	${ VAR } ${ OWS } ${ ANNO_START }
`.replace(/\s+/g, '');

export const CONSTRUCTOR = `
	(\\b(?:public | secret | private | protected)\\b ${ OWS })?
	\\b new \\b ${ OWS } (?:< | \\()
`.replace(/\s+/g, '');

export const METHOD = `
	(\\b static \\b ${ OWS })?
	(\\b(?:public | secret | private | protected)\\b ${ OWS })?
	(\\b override \\b ${ OWS })?
	(\\b final \\b ${ OWS })?
	(\\b mutating \\b ${ OWS })?
	${ VAR } ${ OWS } (?:< | \\()
`.replace(/\s+/g, '');
