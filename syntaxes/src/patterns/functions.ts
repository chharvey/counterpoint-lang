import {
	pattern_name,
	lookaheads,
	lookbehinds,
	R,
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
	label,
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
			qualified_name(false),
		]),
	]
};


export const TYPE__FUNCTION = {
	name: pattern_name('meta.type.func'),
	begin: R.s(BACKSLASH, lookaheads([R.s(OWS, R.c(DELIMS.PARAMS_GN[0], DELIMS.PARAMS_FN[0]))])),
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
	begin: R.s(BACKSLASH, lookaheads([R.s(OWS, R.c(DELIMS.PARAMS_GN[0], DELIMS.CAPTURES[0], DELIMS.PARAMS_FN[0]))])),
	end:   R.c(lookbehinds([BLOCK_END]), FATARROW),
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
	begin: lookaheads([R.s(R.o(R.s(COMP_ACCESS, OWS)), R.w('typefunc'))]),
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
			match: R.w('typefunc'),
		},
		{include: '#IdentifierType'}, // must come after keywords
	],
};


export const DECLARATION__FUNCTION = {
	name:  pattern_name('meta.declaration.func'),
	begin: lookaheads([R.s(R.o(R.s(COMP_ACCESS, OWS)), R.w('func'))]),
	end:   R.c(lookbehinds([BLOCK_END]), ';'),
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
			match: R.w('func'),
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
		label(ASSN_START, '#IdentifierParameter'),
		constraint(lookaheads([ASSN_START, ',', DELIMS.PARAMS_GN[1]])),
		assignment(lookaheads([',', DELIMS.PARAMS_GN[1]]), true),
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
			begin: lookaheads([R.s(R.o(R.s(VAR, OWS)), R.o(R.s(OPT, OWS)), ANNO_START)]),
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
		label(ASSN_START, '#IdentifierParameter'),
		annotation(lookaheads([ASSN_START, ',', DELIMS.PARAMS_FN[1]])),
		assignment(lookaheads([',', DELIMS.PARAMS_FN[1]])),
		{include: '#IdentifierParameter'},
	],
};
