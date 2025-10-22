import {
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



export const ARGUMENTS = list('meta.arguments.cp', DELIMS.ARGS_FN[0], DELIMS.ARGS_FN[1], [
	{
		name: 'keyword.other.spread.cp',
		match: '##|#',
	},
	argumentLabel(DELIMS.ARGS_FN[1]),
	{include: '#Expression'}, // must come after `argumentLabel` because we don’t want expressions to look like named arguments or argument destructuring
]);


export const EXPRESSION__CLAIM = {
	name:          'meta.expression.claim.cp',
	begin:         `\\b(as)\\b${ lookaheads([`${ OWS }(${ DELIMS.CLAIM[0] })`]) }`,
	end:           DELIMS.CLAIM[1],
	beginCaptures: {1: {name: 'keyword.operator.text.cp'}},
	endCaptures:   {0: {name: 'punctuation.delimiter.cp'}},
	patterns:      [
		{
			name:  'punctuation.delimiter.cp',
			match: DELIMS.CLAIM[0],
		},
		{include: '#Type'},
	],
};


export const EXPRESSION__CALL = {
	name: 'meta.expression.call.cp',
	begin: [`(${ DOT_ACCESS }${ DOT }{2}?)`, lookaheads([[OWS, `(${ DELIMS.ARGS_GN[0] }|${ DELIMS.ARGS_FN[0] })`].join('')])].join(''),
	end:   lookbehinds([DELIMS.ARGS_FN[1]]),
	beginCaptures: {
		1: {name: 'keyword.operator.punctuation.cp'},
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
			name: 'meta.expression.access.cp',
			begin: [DOT_ACCESS, lookaheads([[OWS, DELIMS.ACCESS[0]].join('')])].join(''),
			end:   lookbehinds([DELIMS.ACCESS[1]]),
			beginCaptures: {
				1: {name: 'keyword.operator.punctuation.cp'},
			},
			patterns: [
				{include: '#Expression'},
			],
		},
		{
			name: 'meta.expression.access.cp',
			begin: [DOT_ACCESS, lookaheads([[OWS, `(${ INT }|${ VAR })`].join('')])].join(''),
			end:   lookbehinds(['[A-Za-z0-9_\']']),
			beginCaptures: {
				1: {name: 'keyword.operator.punctuation.cp'},
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
			name: 'keyword.operator.punctuation.cp',
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


export const EXPRESSION__STRUCTURE__GROUPING = {
	name: 'meta.expression.structure.grouping.cp',
	begin: DELIMS.GROUPING[0],
	end:   DELIMS.GROUPING[1],
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#PossibleParameter'},
		{include: '#Expression'},
	],
};


export const EXPRESSION__STRUCTURE__LIST = list('meta.expression.structure.list.cp', DELIMS.LIST[0], DELIMS.LIST[1], [
	{
		name: 'keyword.other.spread.cp',
		match: '##|#',
	},
	property(DELIMS.LIST[1]),
	{include: '#Expression'}, // must come after `property` because we don’t want expressions to look like record keys or property destructuring
]);


export const EXPRESSION__STRUCTURE__SET = list('meta.expression.structure.set.cp', DELIMS.SET[0], DELIMS.SET[1], [
	{
		name: 'keyword.other.spread.cp',
		match: '#',
	},
	{
		name: 'keyword.operator.punctuation.cp',
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
			name: 'keyword.operator.punctuation.cp',
			match: '===|!==|\\+\\+|<=|>=|==|&&|\\|\\||~[~?!]|![<>=&|]|[\\^*/]',
		},
		{
			name: 'keyword.operator.text.cp',
			match: '\\b(nat|int|float|is|isnt|if|then|else)\\b',
		},
		{include: '#ExpressionFunction'},
		{
			// covers less-than symbol and generic parameters of a function expression
			name:     'meta.lessthanorgenericparameters.cp',
			begin:    DELIMS.CLAIM[0],
			end:      `${ DELIMS.CLAIM[1] }|${ lookaheads([`[${ DELIMS.GROUPING[1] }${ DELIMS.LIST[1] },;]`, DELIMS.SET[1], THINARROW, '\\b(then|else|do|to|by)\\b']) }`,
			captures: {0: {name: 'punctuation.delimiter.cp'}},
			patterns: [
				{include: '#PossibleGenericParameter'},
				{include: '#Expression'},
			],
		},
		{include: '#ExpressionClass'},
		{include: '#ExpressionClaim'},
		{include: '#ExpressionCall'},
		{include: '#ExpressionAccess'},
		{include: '#ExpressionStructureGrouping'},
		{include: '#ExpressionStructureList'},
		{include: '#ExpressionStructureSet'},
		{
			name:  'keyword.operator.text.cp',
			match: '\\b(as)(\\b|[?!])', // must come after '#ExpressionClaim'
		},
		unit(),
		{
			name: 'keyword.operator.punctuation.cp',
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
