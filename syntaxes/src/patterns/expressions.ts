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
	THINARROW,
	DOT,
	DOT_ACCESS,
} from '../selectors.ts';
import {
	identifier,
	unit,
	list,
	property,
	argumentLabel,
} from './_helpers.ts';



export const ARGUMENTS = list(pattern_name('meta.arguments'), DELIMS.ARGS_FN[0], DELIMS.ARGS_FN[1], [
	{
		name: pattern_name('keyword.other.spread'),
		match: '##|#',
	},
	argumentLabel(),
	{include: '#Expression'}, // must come after `argumentLabel` because we don’t want expressions to look like named arguments or argument destructuring
]);


export const EXPRESSION__CLAIM = {
	name:          pattern_name('meta.expression.claim'),
	begin:         R.s(R.w('as'), lookaheads([R.s(OWS, DELIMS.CLAIM[0])])),
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
			begin: R.s(DOT_ACCESS, lookaheads([R.s(OWS, R.c(INT, VAR))])),
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
	begin: R.s(
		lookbehinds([R.s(R.c(
			'[A-Za-z0-9_]|~[~?!]',
			DELIMS.GROUPING[1],
			'\\}', // DELIMS.BLOCK[1],
			DELIMS.LIST[1],
			'\\}', // DELIMS.SET[1],
			DELIMS.ARGS_GN[1],
			DELIMS.ARGS_FN[1],
		), OWS)]),
		lookaheads([DELIMS.ARGS_GN[0], DELIMS.ARGS_FN[0]]),
	),
	end:      lookbehinds([DELIMS.ARGS_FN[1]]),
	patterns: [
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
		unit(),
	],
};


export const EXPRESSION__STRUCTURE__GROUPING = list(pattern_name('meta.expression.structure.grouping_or_tuple'), DELIMS.GROUPING[0], DELIMS.GROUPING[1], [
	{
		name: pattern_name('keyword.other.spread'),
		match: '##|#',
	},
	property(DELIMS.GROUPING[1]),
	{include: '#Expression'}, // must come after `property` because we don’t want expressions to look like record keys or property destructuring
]);


export const EXPRESSION__STRUCTURE__LIST = list(pattern_name('meta.expression.structure.list'), DELIMS.LIST[0], DELIMS.LIST[1], [
	{
		name: pattern_name('keyword.other.spread'),
		match: '##|#',
	},
	property(DELIMS.LIST[1]),
	{include: '#Expression'}, // must come after `property` because we don’t want expressions to look like dict keys or property destructuring
]);


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


export const EXPRESSIONNONBLOCK = {
	patterns: [
		{
			name: pattern_name('keyword.operator.punctuation'),
			match: '===|!==|\\+\\+|<=|>=|==|&&|\\|\\||~[~?!]|![<>=&|]|[\\^*/]',
		},
		{
			name: pattern_name('keyword.operator.text'),
			match: R.c(R.w(R.c('isset', 'int', 'nat', 'float', 'dec', 'is', 'if', 'then', 'else')), R.s(R.c('!isset', '!is'), '\\b')),
		},
		{include: '#ExpressionFunction'},
		{include: '#ExpressionClass'},
		{include: '#ExpressionClaim'},
		{include: '#ExpressionAccess'},
		{include: '#ExpressionCall'},
		{include: '#ExpressionStructureGrouping'},
		{include: '#ExpressionStructureList'},
		{include: '#ExpressionStructureSet'},
		{
			name:  pattern_name('keyword.operator.text'),
			match: '\\b(as)([?!]|\\b)', // must come after '#ExpressionClaim'
		},
		unit(),
		{
			name: pattern_name('keyword.operator.punctuation'),
			match: `[
				! ?   # must come after '#ExpressionCall', 'as[?!]?', and '#ExpressionAccess'
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
