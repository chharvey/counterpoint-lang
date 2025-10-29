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
	REF,
	MUTABLE,
	VARIANCE,
	CONSTRAINT,
	IMPL,
	ANNO_START,
	ASSN_START,
	DFLT_START,
	FATARROW,
	BLOCK_END,
	BACKSLASH,
} from '../selectors.js';
import {
	identifier,
	list,
	constraint,
	annotation,
	assignment,
	implicitReturn,
} from './_helpers.js';



export const TYPE__FUNCTION = {
	name: 'meta.type.func.cp',
	begin: [BACKSLASH, lookaheads([`${ OWS }(${ DELIMS.PARAMS_GN[0] }|${ DELIMS.PARAMS_FN[0] })`])].join(''),
	end:   FATARROW,
	beginCaptures: {
		1: {name: 'punctuation.delimiter.cp'},
	},
	endCaptures: {
		0: {name: 'keyword.operator.punctuation.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#TypeParameters'},
	],
};


export const EXPRESSION__FUNCTION = {
	name: 'meta.expression.func.cp',
	begin: [BACKSLASH, lookaheads([`${ OWS }(${ DELIMS.PARAMS_GN[0] }|${ DELIMS.CAPTURES[0] }|${ DELIMS.PARAMS_FN[0] })`])].join(''),
	end:   [lookbehinds([BLOCK_END]), FATARROW].join('|'),
	beginCaptures: {
		1: {name: 'punctuation.delimiter.cp'},
	},
	endCaptures: {
		0: {name: 'storage.type.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#Captures'},
		{include: '#Parameters'},
		{include: '#Block'},
		annotation(lookaheads([DELIMS.BLOCK[0], FATARROW]), true),
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


export const DECLARATION__FUNCTION = {
	name:  'meta.declaration.function.cp',
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(function)\\b`]),
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
			match: COMP_ACCESS,
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
		annotation(lookaheads([IMPL, DELIMS.BLOCK[0], FATARROW]), true),
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


/**
 * Generic parameter, if on separate line.
 * We need this in cases where TextMate thinks we’re in a generic argument list when we’re really in a generic parameter list.
 * ```cp
 * type T = .<
 * %        ^ TextMate thinks this is the start of a type call, not a type function
 * 	U narrows V,
 * >() => U;
 * ```
 */
export const GENERIC_PARAMETER_POSSIBLE = {
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


/**
 * Parameter of function type, if on separate line.
 * We won’t ever use this, because all type parameters will be inside type function syntax
 * and there is no parenthesized type call syntax.
 */
export const TYPE_PARAMETER_POSSIBLE = {
	begin: lookaheads([`(${ VAR }${ OWS })?${ ANNO_START }`]),
	end:   `,|${ lookaheads([DELIMS.PARAMS_FN[1]]) }`,
	endCaptures: {
		0: {name: 'punctuation.separator.cp'},
	},
	patterns: [
		{include: '#TypeParameterPatterns'},
	],
};


/**
 * Parameter of function expression, if on separate line.
 * We need this in cases where TextMate thinks we’re in an argument list when we’re really in a parameter list.
 * ```cp
 * let f = .(
 * %       ^ TextMate thinks this is the start of an expression call, not an expression function
 * 	var x: int,
 * ) => x;
 * ```
 */
export const PARAMETER_POSSIBLE = {
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


export const CAPTURES = list('meta.captures.cp', DELIMS.CAPTURES[0], DELIMS.CAPTURES[1], [
	{
		name:  'storage.modifier.cp',
		match: REF,
	},
	identifier(),
]);
