import {
	lookaheads,
} from './helpers.js';



export const OWS = '(?:\\s+|(%%(?:%?[^%])*%%))*';
export const INT = '(?:\\+|-)?(?:\\\\[bqodxz])?[0-9a-z_]+';
export const VAR = '(?:\\b[A-Za-z_][A-Za-z0-9_]*\\b|`.*`)';

export const ANNO_START = ':';
export const ASSN_START = `=${ lookaheads(['=', '>'], true) }`;
export const TYPEARROW  = '->';
export const ARROW      = '=>';

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
		,?
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
		,?
	${ OWS }\\))
`.replace(/\s+/g, '');

export const CLASS = `
	(\\b (?:final | abstract) \\b ${ OWS })?
	(\\b immutable \\b ${ OWS })?
	(\\b class \\b)
`.replace(/\s+/g, '');

export const INTERFACE = `
	(\\b immutable \\b ${ OWS })?
	(\\b interface \\b)
`.replace(/\s+/g, '');
