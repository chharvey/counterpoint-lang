import {
	pattern_name,
	lookaheads,
	lookbehinds,
} from '../helpers.ts';
import {
	DELIMS,
	OWS,
	VAR,
	COMP_ACCESS,
	REF,
	PUN,
	OPT,
	IMPL,
	CAPTURE,
	ANNO_START,
	ASSN_START,
	FATARROW,
	BLOCK_END,
	BACKSLASH,
} from '../selectors.ts';
import {
	qualified_name,
	list,
	param_label,
	constraint,
	annotation,
	assignment,
	func_heritage,
	implicitReturn,
} from './_helpers.ts';



export const CAPTURES = {
	name:          pattern_name('meta.capture'),
	begin:         CAPTURE,
	end:           lookbehinds([DELIMS.CAPTURES[1]]),
	beginCaptures: {0: {name: pattern_name('storage.modifier')}},
	patterns: [
		list(pattern_name('meta.capture.list'), DELIMS.CAPTURES[0], DELIMS.CAPTURES[1], [
			{
				name:  pattern_name('storage.modifier'),
				match: REF,
			},
			qualified_name(),
		]),
	]
};


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
		{include: '#Parameters'},
		{include: '#Captures'},
		{include: '#Block'},
		annotation(lookaheads([CAPTURE, DELIMS.BLOCK[0], FATARROW]), true),
	],
};


export const DECLARATION__TYPEFUNCTION = {
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
	name:  pattern_name('meta.declaration.func'),
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(func)\\b`]),
	end:   [lookbehinds([BLOCK_END]), ';'].join('|'),
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#GenericParameters'},
		{include: '#Parameters'},
		{include: '#Captures'},
		{include: '#Block'},
		{
			name:  pattern_name('storage.modifier'),
			match: COMP_ACCESS,
		},
		{
			name: pattern_name('storage.type'),
			match: '\\b(func)\\b',
		},
		annotation(lookaheads([IMPL, CAPTURE, DELIMS.BLOCK[0], FATARROW]), true),
		func_heritage(lookaheads([CAPTURE, DELIMS.BLOCK[0], FATARROW])),
		implicitReturn(),
		{include: '#IdentifierFunction'}, // must come after keywords
	],
};


export const GENERIC_PARAMETER_PATTERNS = {
	patterns: [
		{include: '#ModifiersGenericParameter'},
		{include: '#DestructureGenericParameter'},
		{
			name: pattern_name('keyword.other.alias'),
			match: PUN,
		},
		{
			name:  pattern_name('keyword.other.optional'),
			match: OPT,
		},
		param_label(ASSN_START, '#IdentifierParameter'),
		constraint(lookaheads([ASSN_START, ',', DELIMS.PARAMS_GN[1]])),
		assignment(ASSN_START, lookaheads([',', DELIMS.PARAMS_GN[1]]), '#Type'),
		{include: '#IdentifierParameter'},
	],
};


export const TYPE_PARAMETER_PATTERNS = {
	patterns: [
		annotation(lookaheads([',', DELIMS.PARAMS_FN[1]])),
		{
			name:  pattern_name('keyword.other.optional'),
			match: OPT,
		},
		{
			begin: lookaheads([`(${ VAR }${ OWS })?(${ OPT }${ OWS })?${ ANNO_START }`]),
			end:   lookaheads([OPT, ANNO_START]),
			patterns: [
				{include: '#IdentifierParameter'},
			],
		},
		{include: '#Type'}, // must come after `#IdentifierParameter`
	],
};


export const PARAMETER_PATTERNS = {
	patterns: [
		{include: '#ModifiersParameter'},
		{include: '#DestructureParameter'},
		{
			name: pattern_name('keyword.other.alias'),
			match: PUN,
		},
		{
			name:  pattern_name('keyword.other.optional'),
			match: OPT,
		},
		param_label(ASSN_START, '#IdentifierParameter'),
		annotation(lookaheads([ASSN_START, ',', DELIMS.PARAMS_FN[1]])),
		assignment(ASSN_START, lookaheads([',', DELIMS.PARAMS_FN[1]])),
		{include: '#IdentifierParameter'},
	],
};
