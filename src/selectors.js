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

export const DESTRUCTURE = `
	(?<des>\\(${ OWS }
		(?<item>
			${ VAR }\\$? | (?:
				${ VAR }${ OWS }\\b(?:as)\\b${ OWS }
			)?\\g<des>
		)
		(?:${ OWS },${ OWS }\\g<item>)*
	${ OWS }\\))
`.replace(/\s+/g, '');
