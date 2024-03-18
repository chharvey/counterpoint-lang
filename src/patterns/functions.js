import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
	VAR,
	UNFIXED,
	MUTABLE,
	VARIANCE,
	CONSTRAINT,
	ANNO_START,
	ASSN_START,
	DFLT_START,
	FATARROW,
	BLOCK_END,
	FUNCTIONTYPE,
	FUNCTION,
} from '../selectors.js';
import {
	annotation,
	assignment,
	implicitReturn,
} from './_helpers.js';



export const TYPE__FUNCTION = {
	name: 'meta.type.func.cp',
	begin: lookaheads([FUNCTIONTYPE]),
	end:   FATARROW,
	endCaptures: {
		0: {name: 'keyword.operator.punctuation.cp'},
	},
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(async|gen)\\b',
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#TypeParameters'},
	],
};


export const EXPRESSION__FUNCTION = {
	name: 'meta.expression.func.cp',
	begin: lookaheads([FUNCTION]),
	end:   [lookbehinds([BLOCK_END]), FATARROW].join('|'),
	endCaptures: {
		0: {name: 'storage.type.cp'},
	},
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(async|gen)\\b',
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#Captures'},
		{include: '#Parameters'},
		{include: '#Block'},
		annotation(lookaheads([DELIMS.BLOCK[0], FATARROW]), false),
	],
};


export const DECLARATION__TYPEFUNC = {
	name: 'meta.declaration.typefunc.cp',
	begin: lookaheads([`(\\b(public|secret|private)\\b${ OWS })?\\b(typefunc)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#GenericParameters'},
		implicitReturn('#Type'),
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|secret|private)\\b',
		},
		{
			name: 'storage.type.cp',
			match: '\\b(typefunc)\\b',
		},
		{include: '#IdentifierType'}, // must come after keywords
	],
};


export const DECLARATION__FUNC = {
	name: 'meta.declaration.func.cp',
	begin: lookaheads([`(\\b(public|secret|private)\\b${ OWS })?\\b(function)\\b(${ OWS }\\b(async)\\b)?(${ OWS }\\b(gen)\\b)?`]),
	end:   [lookbehinds([BLOCK_END]), ';'].join('|'),
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#GenericParameters'},
		{include: '#Captures'},
		{include: '#Parameters'},
		{include: '#Block'},
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|secret|private|async|gen)\\b',
		},
		{
			name: 'storage.type.cp',
			match: '\\b(function)\\b',
		},
		{
			name: 'meta.heritage.cp',
			begin: '\\b(implements)\\b',
			end:   lookaheads([DELIMS.CAPTURES[0], DELIMS.PARAMS_FN[0]]),
			beginCaptures: {
				0: {name: 'storage.modifier.cp'},
			},
			patterns: [
				{include: '#TypeCall'},
				{include: '#IdentifierType'},
			],
		},
		annotation(lookaheads([DELIMS.BLOCK[0], FATARROW]), false),
		implicitReturn(),
		{include: '#IdentifierFunction'}, // must come after keywords
	],
};


export const GENERIC_PARAMETER_PATTERNS = {
	patterns: [
		{
			name:  'storage.modifier.cp',
			match: MUTABLE,
		},
		{
			name: 'storage.modifier.cp',
			match: VARIANCE,
		},
		{
			name:  'punctuation.delimiter.cp',
			match: ASSN_START,
		},
		{
			name: 'meta.heritage.cp',
			begin: CONSTRAINT,
			end:   lookaheads([DFLT_START, ',', DELIMS.PARAMS_GN[1]]),
			beginCaptures: {
				0: {name: 'storage.modifier.cp'},
			},
			patterns: [
				{include: '#Type'},
			],
		},
		{include: '#IdentifierParameter'},
		assignment(DFLT_START, lookaheads([',', DELIMS.PARAMS_GN[1]]), '#Type'),
	],
};


export const TYPE_PARAMETER_PATTERNS = {
	patterns: [
		annotation(lookaheads([',', DELIMS.PARAMS_FN[1]])),
		{
			begin: lookaheads([`${ VAR }${ OWS }${ ANNO_START }`]),
			end:   lookaheads([ANNO_START]),
			patterns: [
				{include: '#IdentifierParameter'},
			],
		},
		{include: '#Type'}, // must come after `variable.parameter.cp` so that it isn’t confused with `entity.name.type.cp`
	],
};


export const PARAMETER_PATTERNS = {
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: UNFIXED,
		},
		{
			name:  'punctuation.delimiter.cp',
			match: ASSN_START,
		},
		{include: '#IdentifierParameter'},
		{include: '#DestructureParameter'},
		annotation(lookaheads([DFLT_START, ',', DELIMS.PARAMS_FN[1]])),
		assignment(DFLT_START, lookaheads([',', DELIMS.PARAMS_FN[1]])),
	],
};


/** Generic parameter, if on separate line. */
export const POSSIBLE_GENERIC_PARAMETER = {
	begin: lookaheads([MUTABLE, VARIANCE, [VAR, OWS, `(${ [
		CONSTRAINT, DFLT_START, ',', // annotated, initialized, or more than 1 generic parameter
	].join('|') })`].join('')]),
	end: `,|${ lookaheads([DELIMS.PARAMS_GN[1]]) }`,
	endCaptures: {
		0: {name: 'punctuation.separator.cp'},
	},
	patterns: [
		{include: '#GenericParameterPatterns'},
	],
};


/** Parameter of function type, if on separate line. */
export const POSSIBLE_TYPE_PARAMETER = {
	begin: lookaheads([`(${ VAR }${ OWS })?${ ANNO_START }`]),
	end:   `,|${ lookaheads([DELIMS.PARAMS_FN[1]]) }`,
	endCaptures: {
		0: {name: 'punctuation.separator.cp'},
	},
	patterns: [
		{include: '#TypeParameterPatterns'},
	],
};


/** Parameter of function expression, if on separate line. */
export const POSSIBLE_PARAMETER = {
	begin: lookaheads([UNFIXED, [VAR, OWS, `(${ [
		ASSN_START, ANNO_START, DFLT_START, ',', // aliased, annotated, or initialized, or more than 1 parameter
	].join('|') })`].join('')]),
	end: `,|${ lookaheads([DELIMS.PARAMS_FN[1]]) }`,
	endCaptures: {
		0: {name: 'punctuation.separator.cp'},
	},
	patterns: [
		{include: '#ParameterPatterns'},
	],
};
