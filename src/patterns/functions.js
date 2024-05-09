import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
	VAR,
	COMP_ACCESS,
	UNFIXED,
	MUTABLE,
	VARIANCE,
	CONSTRAINT,
	IMPL,
	ANNO_START,
	ASSN_START,
	DFLT_START,
	FATARROW,
	BLOCK_END,
	FUNCTIONTYPE,
	FUNCTION,
} from '../selectors.js';
import {
	identifier,
	constraint,
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
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(typefunc)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#GenericParameters'},
		implicitReturn('#Type'),
		{
			name:  'storage.modifier.cp',
			match: COMP_ACCESS,
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
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(function)\\b(${ OWS }\\b(async)\\b)?(${ OWS }\\b(gen)\\b)?`]),
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
			name:  'storage.modifier.cp',
			match: `\\b(${ COMP_ACCESS }|async|gen)\\b`,
		},
		{
			name: 'storage.type.cp',
			match: '\\b(function)\\b',
		},
		{
			name:  'meta.heritage.cp',
			begin: IMPL,
			end:   lookaheads([DELIMS.BLOCK[0], FATARROW]),
			beginCaptures: {
				0: {name: 'storage.modifier.cp'},
			},
			patterns: [
				{include: '#TypeCall'},
				identifier('entity.other.inherited-class'),
			],
		},
		annotation(lookaheads([IMPL, DELIMS.BLOCK[0], FATARROW]), false),
		implicitReturn(),
		{include: '#IdentifierFunction'}, // must come after keywords
	],
};


export const GENERIC_PARAMETER_PATTERNS = {
	patterns: [
		{include: '#ModifiersGenericParameter'},
		{include: '#DestructureGenericParameter'},
		constraint(lookaheads([DFLT_START, ',', DELIMS.PARAMS_GN[1]])),
		assignment(DFLT_START, lookaheads([',', DELIMS.PARAMS_GN[1]]), '#Type'),
		{
			name:  'punctuation.delimiter.cp',
			match: ASSN_START,
		},
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
		{include: '#ModifiersParameter'},
		{include: '#DestructureParameter'},
		annotation(lookaheads([DFLT_START, ',', DELIMS.PARAMS_FN[1]])),
		assignment(DFLT_START, lookaheads([',', DELIMS.PARAMS_FN[1]])),
		{
			name:  'punctuation.delimiter.cp',
			match: ASSN_START,
		},
		{include: '#IdentifierParameter'},
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
