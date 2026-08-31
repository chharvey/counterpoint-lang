import {
	lookaheads,
	R,
} from './helpers.ts';



export const DELIMS = {
	GROUPING:  ['\\(', '\\)'],
	LIST:      ['\\[', '\\]'],
	SET:       ['\\{', '\\}'],
	ARGS_GN:   ['\\[', '\\]'],
	ARGS_FN:   ['\\(', '\\)'],
	CLAIM:     [':',   ':'],
	BLOCK:     ['\\{', '\\}'],
	PARAMS_GN: ['\\[', '\\]'],
	PARAMS_FN: ['\\(', '\\)'],
	CAPTURES:  ['\\(', '\\)'],
	DESTRUCT:  ['\\(', '\\)'],
	IMPORT:    ['\\(', '\\)'],
	HERITAGE:  ['\\(', '\\)'],
} as const;

export const OWS     = '(?:\\s+|(%%(?:%?[^%])*%%))*';
export const INT     = '(?:\\+|-)?(?:\\\\[bqsodxz])?[0-9a-z_]+';
export const VARNAME = '\\b[A-Za-z_][A-Za-z0-9_]*\\b';
export const VAR     = `(?:${ VARNAME }|\'.*\')`;

export const COMP_ACCESS = R.w(R.c('public', 'internal', 'private'));
export const OPEN        = R.w('open');
export const MEMB_ACCESS = R.w(R.c(COMP_ACCESS, 'protected'));
export const WRITABLE    = R.w('mut');
export const REF         = R.w('ref');
export const NOMINAL     = R.w('nominal');
export const MUTATING    = R.w('mut');
export const MUTABLE     = R.w('mut');
export const STRUCTURAL  = R.w('struct');
export const ALIAS       = R.w('as');
export const PUN        = '\\$';
export const OPT        = '\\?';
export const VARIANCE   = R.c('\\bin\\(out\\)', '\\bout\\(in\\)', '\\(inout\\)', '\\(in\\)', '\\(out\\)', R.w('in'), R.w('out'));
export const CONSTRAINT = R.w(R.c('narrows', 'widens'));
export const PERMISSION = R.w(R.c(WRITABLE, 'readonly', 'writeonly', 'guarded', 'veiled'));
export const IMPL       = R.w('impl');
export const FIELD_IMPL = R.w(R.c(IMPL, 'claim'));
export const METH_IMPL  = R.w(R.c('override', IMPL, 'claim'));
export const CAPTURE    = R.w('with');
export const ANNO_START = `\\:${ lookaheads(['\\:'], true) }`;
export const ASSN_START = `=${ lookaheads(['[=>]'], true) }`;
export const THINARROW  = '->';
export const FATARROW   = '=>';
export const DOT_ACCESS = '\\.';
export const DOT_CALL   = '\\.\\.';
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
	(${ FIELD_IMPL } ${ OWS })?
	(${ PERMISSION } ${ OWS })?
	${ VAR } ${ OWS } (${ OPT } ${ OWS })?
	(?:${ ANNO_START } | ${ ASSN_START })
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
	(${ METH_IMPL } ${ OWS })?
	(${ OPEN } ${ OWS })?
	(${ MUTATING } ${ OWS })?
	(?:${ VAR } ${ OWS })? (?:${ DELIMS.PARAMS_GN[0] } | ${ DELIMS.PARAMS_FN[0] })
`.replace(/\s+/g, '');

export const METHODGROUP = `
	(${ MEMB_ACCESS } ${ OWS })?
	(${ METH_IMPL } ${ OWS })?
	(${ OPEN } ${ OWS })?
	${ VAR } ${ OWS } ${ DELIMS.BLOCK[0] }
`.replace(/\s+/g, '');
