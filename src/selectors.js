import {
	lookaheads,
	lookbehinds,
} from './helpers.js';



export const OWS = '(?:\\s+|(%%(?:%?[^%])*%%))*';
export const INT = '(?:\\+|-)?(?:\\\\[bqodxz])?[0-9a-z_]+';
export const VAR = '(?:\\b[A-Za-z_][A-Za-z0-9_]*\\b|`.*`)';

export const ANNO_START = `(?:\\:${ lookaheads(['\\:'], true) }|\\?\\:)`;
export const ASSN_START = `=${ lookaheads(['=', '>'], true) }`;
export const DEST_START = '\\(';
export const DEST_END   = '\\)';
export const THINARROW  = '->';
export const FATARROW   = '=>';
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



export const FIELD = `
	(\\b(?:public | secret | private | protected)\\b ${ OWS })?
	(\\b(?:override | claim)\\b ${ OWS })?
	(\\b(?:final | readonly)\\b ${ OWS })?
	${ VAR } ${ OWS } ${ ANNO_START }
`.replace(/\s+/g, '');

export const FIELD_CONSTRUCTOR = `
	\\b(?:public | secret | private | protected)\\b ${ OWS }
	(\\b override \\b ${ OWS })?
	(\\b(?:final | readonly)\\b ${ OWS })?
	(?:
		(${ VAR } ${ OWS } \\b as \\b ${ OWS })? (\\b unfixed \\b ${ OWS })? ${ VAR } ${ OWS } ${ ANNO_START }
		| ${ VAR } ${ OWS } \\b as \\b ${ OWS } ${ DEST_START }
	)
`.replace(/\s+/g, '');

export const CONSTRUCTOR = `
	(\\b(?:public | secret | private | protected)\\b ${ OWS })?
	(?:\\b new \\b ${ OWS })? \\(
`.replace(/\s+/g, '');

export const CONSTRUCTORGROUP = `
	(\\b(?:public | secret | private | protected)\\b ${ OWS })?
	\\b new \\b ${ OWS } \\{
`.replace(/\s+/g, '');

export const METHOD = `
	(\\b(?:public | secret | private | protected)\\b ${ OWS })?
	(\\b(?:override | claim)\\b ${ OWS })?
	(\\b final \\b ${ OWS })?
	(\\b mutating \\b ${ OWS })?
	(?:\\b async \\b ${ OWS })?
	(?:\\b gen \\b ${ OWS })?
	(?:${ VAR } ${ OWS })? (?:< | \\()
`.replace(/\s+/g, '');

export const METHODGROUP = `
	(\\b(?:public | secret | private | protected)\\b ${ OWS })?
	(\\b(?:override | claim)\\b ${ OWS })?
	(\\b final \\b ${ OWS })?
	(\\b mutating \\b ${ OWS })?
	${ VAR } ${ OWS } \\{
`.replace(/\s+/g, '');
