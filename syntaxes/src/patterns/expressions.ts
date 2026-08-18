import {
	pattern_name,
	lookaheads,
	lookbehinds,
	R,
} from '../helpers.ts';
import {
	DELIMS,
	OWS,
	INT,
	VAR,
	PUN,
	ASSN_START,
	THINARROW,
	DOT_ACCESS,
	DOT_CALL,
	destructure_selector,
} from '../selectors.ts';
import {
	identifier,
	unit,
	list,
	label,
	assignment,
} from './_helpers.ts';



function argument_or_property(end: string, destructure_kind: string, identifier_kind: string) {
	return [
		{
			end,
			begin:    lookaheads([R.s(destructure_selector(ASSN_START), OWS, ASSN_START)]), // need to include `ASSN_START`, otherwise could be grouping/tuple/record
			patterns: [
				{include: destructure_kind},
				assignment(end),
			],
		},
		{
			end,
			begin:         PUN,
			beginCaptures: {0: {name: pattern_name('keyword.other.alias')}},
			patterns:      [{include: identifier_kind}],
		},
		label(ASSN_START, identifier_kind),
		assignment(end),
		{
			name: pattern_name('keyword.other.spread'),
			match: '##|#',
		},
		{include: '#Expression'},
	];
}


export const ARGUMENTS = list(pattern_name('meta.arguments'), DELIMS.ARGS_FN[0], DELIMS.ARGS_FN[1], argument_or_property(
	lookaheads([',', DELIMS.ARGS_FN[1]]),
	'#DestructureArgument',
	'#IdentifierParameter',
));


export const EXPRESSION__CLAIM = {
	name:          pattern_name('meta.expression.claim'),
	begin:         R.s(R.g(R.w('as')), lookaheads([R.s(OWS, DELIMS.CLAIM[0])])),
	end:           lookbehinds([DELIMS.CLAIM[1]]),
	beginCaptures: {1: {name: pattern_name('keyword.operator.text')}},
	patterns:      [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{
			name:     pattern_name('meta.expression.claim.type'),
			begin:    DELIMS.CLAIM[0],
			end:      DELIMS.CLAIM[1],
			captures: {0: {name: pattern_name('punctuation.delimiter')}},
			patterns: [{include: '#Type'}],
		},
	],
};


export const EXPRESSION__ACCESS = {
	patterns: [
		{
			name: pattern_name('meta.expression.access'),
			begin: R.s(R.g(DOT_ACCESS)),
			end:   lookbehinds(['[A-Za-z0-9_\']']),
			beginCaptures: {
				1: {name: pattern_name('keyword.operator.punctuation')},
			},
			patterns: [
				{include: '#Number'},
				identifier('variable.other', true),
			],
		},
	],
};


export const EXPRESSION__CALL = {
	name:  pattern_name('meta.expression.call'),
	begin: R.c(R.g(DOT_CALL), R.s(
		lookbehinds([R.s(R.c(
			'[A-Za-z0-9_\']|~[~?!]|\\+\\+',
			DELIMS.GROUPING[1],
			DELIMS.BLOCK[1],
			DELIMS.LIST[1],
			DELIMS.SET[1],
			DELIMS.ARGS_GN[1],
			DELIMS.ARGS_FN[1],
		), '[?!]?')]),
		lookaheads([DELIMS.ARGS_GN[0], DELIMS.ARGS_FN[0]]),
	)),
	end:           R.s(lookbehinds([DELIMS.ARGS_FN[1]]), lookaheads([DELIMS.ARGS_GN[0], DELIMS.ARGS_FN[0]], true)),
	beginCaptures: {1: {name: pattern_name('keyword.operator.punctuation')}},
	patterns:      [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericArguments'},
		{include: '#Arguments'},
	],
};


export const EXPRESSION__ASSIGNEE = {
	patterns: [
		{
			name: pattern_name('keyword.operator.punctuation'),
			match: '\\+\\+|~[~?!]',
		},
		{include: '#DestructureAssignment'},
		{include: '#ExpressionAccess'},
		{include: '#ExpressionCall'},
		{include: '#ExpressionStructureGrouping'},
		{include: '#ExpressionStructureList'},
		{include: '#ExpressionStructureSet'},
		unit(false),
	],
};


export const EXPRESSION__STRUCTURE__GROUPING = list(pattern_name('meta.expression.structure.grouping-or-tuple'), DELIMS.GROUPING[0], DELIMS.GROUPING[1], argument_or_property(
	lookaheads([',', DELIMS.GROUPING[1]]),
	'#DestructureProperty',
	'#IdentifierProperty',
));


export const EXPRESSION__STRUCTURE__LIST = list(pattern_name('meta.expression.structure.list'), DELIMS.LIST[0], DELIMS.LIST[1], argument_or_property(
	lookaheads([',', DELIMS.LIST[1]]),
	'#DestructureProperty',
	'#IdentifierProperty',
));


export const EXPRESSION__STRUCTURE__SET = list(pattern_name('meta.expression.structure.set'), DELIMS.SET[0], DELIMS.SET[1], [
	{
		name: pattern_name('keyword.other.spread'),
		match: '#',
	},
	{
		name: pattern_name('keyword.operator.punctuation'),
		match: THINARROW,
	},
	{include: '#Statement'}, // used only for block expressions where sets could be, e.g. `a + ({ b; })`
	{include: '#Expression'},
]);


export const EXPRESSION__SWITCH = {
	name:          pattern_name('meta.expression.switch'),
	begin:         R.w('switch'),
	end:           lookaheads([',', '\\)', '\\]', '\\}', ';']),
	beginCaptures: {0: {name: pattern_name('keyword.operator.text')}},
	patterns:      [
		{
			name:  pattern_name('keyword.operator.text'),
			match: R.w(R.c('case', 'default')),
		},
		{
			name:  pattern_name('keyword.operator.punctuation'),
			match: THINARROW,
		},
		{include: '#Expression'},
		{
			name:  pattern_name('keyword.operator.punctuation'),
			match: '\\|',
		},
	],
};


export const EXPRESSIONNONBLOCK = {
	patterns: [
		{
			name: pattern_name('keyword.operator.punctuation'),
			match: '===|!==|\\+\\+|<=|>=|==|&&|\\|\\||~[~?!]|![<>=&|]|[\\^*/]',
		},
		{
			name: pattern_name('keyword.operator.text'),
			match: R.c(R.w(R.c('is', 'if', 'then', 'else')), '!is\\b'),
		},
		{include: '#ExpressionFunction'},
		{include: '#ExpressionClass'},
		{include: '#ExpressionClaim'},
		{include: '#ExpressionCall'}, // must come before '#ExpressionAccess' due to `DOT_CALL`
		{include: '#ExpressionAccess'},
		{include: '#ExpressionStructureGrouping'},
		{include: '#ExpressionStructureList'},
		{include: '#ExpressionStructureSet'},
		{include: '#ExpressionSwitch'},
		{
			name:  pattern_name('keyword.operator.text'),
			match: '\\b(as)([?!]|\\b)', // must come after '#ExpressionClaim'
		},
		unit(false),
		{
			name: pattern_name('keyword.operator.punctuation'),
			match: `[
				! ?   # must come after '!is', 'as[?!]?'
				+ \\- # must come after 'unit'
				< >   # must come after '#ExpressionFunction' and '#ExpressionCall'
			]`.replace(/\#.*\n|\s+/g, ''),
		},
	],
};


export const EXPRESSION = {
	patterns: [
		{include: '#Expressionnonblock'},
		{include: '#Block'},
	],
};
