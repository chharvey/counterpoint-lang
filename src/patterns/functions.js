import {
	pattern_name,
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
	name: pattern_name('meta.type.func'),
	begin: [BACKSLASH, lookaheads([`${ OWS }(${ DELIMS.PARAMS_GN[0] }|${ DELIMS.PARAMS_FN[0] })`])].join(''),
	end:   FATARROW,
	beginCaptures: {
		1: {name: pattern_name('punctuation.delimiter')},
	},
	endCaptures: {
		0: {name: pattern_name('keyword.operator.punctuation')},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#TypeParameters'},
	],
};


export const EXPRESSION__FUNCTION = {
	name: pattern_name('meta.expression.func'),
	begin: [BACKSLASH, lookaheads([`${ OWS }(${ DELIMS.PARAMS_GN[0] }|${ DELIMS.CAPTURES[0] }|${ DELIMS.PARAMS_FN[0] })`])].join(''),
	end:   [lookbehinds([BLOCK_END]), FATARROW].join('|'),
	beginCaptures: {
		1: {name: pattern_name('punctuation.delimiter')},
	},
	endCaptures: {
		0: {name: pattern_name('storage.type')},
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
	name: pattern_name('meta.declaration.typefunc'),
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(typefunc)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#GenericParameters'},
		implicitReturn('#Type'),
		{
			name:  pattern_name('storage.modifier'),
			match: COMP_ACCESS,
		},
		{
			name: pattern_name('storage.type'),
			match: '\\b(typefunc)\\b',
		},
		{include: '#IdentifierType'}, // must come after keywords
	],
};


export const DECLARATION__FUNCTION = {
	name:  pattern_name('meta.declaration.function'),
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(function)\\b`]),
	end:   [lookbehinds([BLOCK_END]), ';'].join('|'),
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#GenericParameters'},
		{include: '#Captures'},
		{include: '#Parameters'},
		{include: '#Block'},
		{
			name:  pattern_name('storage.modifier'),
			match: COMP_ACCESS,
		},
		{
			name: pattern_name('storage.type'),
			match: '\\b(function)\\b',
		},
		{
			name:  pattern_name('meta.heritage'),
			begin: IMPL,
			end:   lookaheads([DELIMS.BLOCK[0], FATARROW]),
			beginCaptures: {
				0: {name: pattern_name('storage.modifier')},
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
			name:  pattern_name('punctuation.delimiter'),
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
		{include: '#Type'}, // must come after `variable.parameter` so that it isn’t confused with `entity.name.type`
	],
};


export const PARAMETER_PATTERNS = {
	patterns: [
		{include: '#ModifiersParameter'},
		{include: '#DestructureParameter'},
		annotation(lookaheads([DFLT_START, ',', DELIMS.PARAMS_FN[1]])),
		assignment(DFLT_START, lookaheads([',', DELIMS.PARAMS_FN[1]])),
		{
			name:  pattern_name('punctuation.delimiter'),
			match: ASSN_START,
		},
		{include: '#IdentifierParameter'},
	],
};


export const CAPTURES = list(pattern_name('meta.captures'), DELIMS.CAPTURES[0], DELIMS.CAPTURES[1], [
	{
		name:  pattern_name('storage.modifier'),
		match: REF,
	},
	identifier(),
]);
