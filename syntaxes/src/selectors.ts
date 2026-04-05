import {
	lookaheads,
	R,
} from './helpers.ts';



export const DELIMS = {
	GROUPING:  ['\\(', '\\)'],
	LIST:      ['\\[', '\\]'],
	SET:       ['\\{', `\\}${ lookaheads(['\\}'], true) }`],
	ARGS_GN:   ['\\[', '\\]'],
	ARGS_FN:   ['\\(', '\\)'],
	CLAIM:     [':',   ':'],
	BLOCK:     ['\\{', `\\}${ lookaheads(['\\}'], true) }`],
	CAPTURES:  ['\\(', '\\)'],
	PARAMS_GN: ['\\[', '\\]'],
	PARAMS_FN: ['\\(', '\\)'],
	DESTRUCT:  ['\\(', '\\)'],
	IMPORT:    ['\\(', '\\)'],
};

export const OWS     = '(?:\\s+|(%%(?:%?[^%])*%%))*';
export const INT     = '(?:\\+|-)?(?:\\\\[bqsodxz])?[0-9a-z_]+';
export const VARNAME = '\\b[A-Za-z_][A-Za-z0-9_]*\\b';
export const VAR     = `(?:${ VARNAME }|\'.*\')`;

export const COMP_ACCESS = R.w(R.c('public', 'internal', 'private'));
export const MEMB_ACCESS = R.w(R.c(COMP_ACCESS, 'protected'));
export const UNFIXED     = R.w('mut');
export const REF         = R.w('ref');
export const NOMINAL     = R.w('nominal');
export const MUTABLE     = R.w('mut');
export const ALIAS       = R.w('as');
export const PUN        = '\\$';
export const OPT        = '\\?';
export const VARIANCE   = R.w(R.c('out', 'in'));
export const CONSTRAINT = R.w(R.c('narrows', 'widens'));
export const PERMISSION = R.w(R.c('const', 'readonly', 'writeonly'));
export const IMPL       = R.w('impl');
export const OVR        = R.w(R.c('override', 'impl'));
export const OVR_CLAIM  = R.w(R.c(OVR, 'claim'));
export const CAPTURE    = R.w('with');
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
	(?:${ VAR } ${ OWS })? (?:${ DELIMS.PARAMS_GN[0] } | ${ DELIMS.PARAMS_FN[0] })
`.replace(/\s+/g, '');

export const METHODGROUP = `
	(${ MEMB_ACCESS } ${ OWS })?
	(${ OVR_CLAIM } ${ OWS })?
	(\\b final \\b ${ OWS })?
	${ VAR } ${ OWS } ${ DELIMS.BLOCK[0] }
`.replace(/\s+/g, '');
