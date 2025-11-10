import {
	pattern_name,
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
	INT,
	VAR,
	THINARROW,
	BLOCK_END,
	DOT,
	DOT_ACCESS,
} from '../selectors.js';
import {
	identifier,
	unit,
	list,
	property,
	argumentLabel,
} from './_helpers.js';



export const ARGUMENTS = list(pattern_name('meta.arguments'), DELIMS.ARGS_FN[0], DELIMS.ARGS_FN[1], [
	{
		name: pattern_name('keyword.other.spread'),
		match: '##|#',
	},
	argumentLabel(DELIMS.ARGS_FN[1]),
	{include: '#Expression'}, // must come after `argumentLabel` because we don’t want expressions to look like named arguments or argument destructuring
]);


export const EXPRESSION__CLAIM = {
	name:          pattern_name('meta.expression.claim'),
	begin:         `\\b(as)\\b${ lookaheads([`${ OWS }(${ DELIMS.CLAIM[0] })`]) }`,
	end:           DELIMS.CLAIM[1],
	beginCaptures: {1: {name: pattern_name('keyword.operator.text')}},
	endCaptures:   {0: {name: pattern_name('punctuation.delimiter')}},
	patterns:      [
		{
			name:  pattern_name('punctuation.delimiter'),
			match: DELIMS.CLAIM[0],
		},
		{include: '#Type'},
	],
};


export const EXPRESSION__CALL = {
	name: pattern_name('meta.expression.call'),
	begin: [`(${ DOT_ACCESS }${ DOT }{2}?)`, lookaheads([[OWS, `(${ DELIMS.ARGS_GN[0] }|${ DELIMS.ARGS_FN[0] })`].join('')])].join(''),
	end:   lookbehinds([DELIMS.ARGS_FN[1]]),
	beginCaptures: {
		1: {name: pattern_name('keyword.operator.punctuation')},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericArguments'},
		{include: '#Arguments'},
	],
};


export const EXPRESSION__ACCESS = {
	patterns: [
		{
			name: pattern_name('meta.expression.access'),
			begin: [DOT_ACCESS, lookaheads([[OWS, DELIMS.ACCESS[0]].join('')])].join(''),
			end:   lookbehinds([DELIMS.ACCESS[1]]),
			beginCaptures: {
				1: {name: pattern_name('keyword.operator.punctuation')},
			},
			patterns: [
				{include: '#Expression'},
			],
		},
		{
			name: pattern_name('meta.expression.access'),
			begin: [DOT_ACCESS, lookaheads([[OWS, `(${ INT }|${ VAR })`].join('')])].join(''),
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


export const EXPRESSION__ASSIGNEE = {
	patterns: [
		{
			name: pattern_name('keyword.operator.punctuation'),
			match: '\\+\\+|~[~?!]',
		},
		{include: '#DestructureAssignment'},
		{include: '#ExpressionCall'},
		{include: '#ExpressionAccess'},
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
	{
		// used only for block expressions where sets could be, e.g. `a + ({ b; })`
		patterns: [
			{include: '#Statement'},
		],
	},
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
			match: '\\b(nat|int|float|dec|is|isnt|if|then|else)\\b',
		},
		{include: '#ExpressionFunction'},
		{include: '#ExpressionClass'},
		{include: '#ExpressionClaim'},
		{include: '#ExpressionCall'},
		{include: '#ExpressionAccess'},
		{include: '#ExpressionStructureGrouping'},
		{include: '#ExpressionStructureList'},
		{include: '#ExpressionStructureSet'},
		{
			name:  pattern_name('keyword.operator.text'),
			match: '\\b(as)(\\b|[?!])', // must come after '#ExpressionClaim'
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
