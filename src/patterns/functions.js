import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
	VAR,
	ANNO_START,
	ASSN_START,
	FATARROW,
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
	end:   [lookbehinds(['\\}']), FATARROW].join('|'),
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
	begin: lookaheads([`(\\b(public|secret|private)\\b${ OWS })?\\b(func)\\b(${ OWS }\\b(async)\\b)?(${ OWS }\\b(gen)\\b)?`]),
	end:   [lookbehinds(['\\}']), ';'].join('|'),
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
			match: '\\b(func)\\b',
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
			name: 'storage.modifier.cp',
			match: '\\b(out|in)\\b',
		},
		{
			name: 'meta.heritage.cp',
			begin: '\\b(narrows|widens)\\b',
			end: lookaheads([ASSN_START, ',', DELIMS.PARAMS_GN[1]]),
			beginCaptures: {
				0: {name: 'storage.modifier.cp'},
			},
			patterns: [
				{include: '#Type'},
			],
		},
		assignment(lookaheads([',', DELIMS.PARAMS_GN[1]]), '#Type'),
		{include: '#IdentifierParameter'},
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
			match: '\\b(unfixed)\\b',
		},
		{
			name: 'keyword.other.alias.cp',
			match: '\\b(as)\\b',
		},
		{include: '#IdentifierParameter'},
		{include: '#DestructureParameter'},
		annotation(lookaheads([ASSN_START, ',', DELIMS.PARAMS_FN[1]])),
		assignment(lookaheads([',', DELIMS.PARAMS_FN[1]])),
	],
};


/** Generic parameter, if on separate line. */
export const POSSIBLE_GENERIC_PARAMETER = {
	begin: lookaheads([['(\\b(out|in)\\b)?', OWS, VAR, OWS, `(${ [
		'\\b(narrows|widens)\\b', ASSN_START, ',', // annotated, or more than 1 generic parameter
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
	begin: lookaheads([[`(\\b(unfixed)\\b${ OWS })?`, VAR, OWS, `(${ [
		ANNO_START, ASSN_START, ',', '\\b(as)\\b', // annotated, or assigned, or more than 1 parameter, or aliased
	].join('|') })`].join('')]),
	end: `,|${ lookaheads([DELIMS.PARAMS_FN[1]]) }`,
	endCaptures: {
		0: {name: 'punctuation.separator.cp'},
	},
	patterns: [
		{include: '#ParameterPatterns'},
	],
};
