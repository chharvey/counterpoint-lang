import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	OWS,
	INT,
	VAR,
	ARROW,
} from '../selectors.js';
import {
	identifier,
	unit,
	list,
	propertyOrArgumentLabel,
} from './_helpers.js';



export const ARGUMENTS = list('meta.arguments.cp', '\\(', '\\)', [
	{
		name: 'keyword.other.spread.cp',
		match: '##|#',
	},
	propertyOrArgumentLabel('\\)', '#IdentifierParameter', '#DestructureArgument'),
	{include: '#Expression'}, // must come after argument destructuring because of untyped lambda parameters
]);


export const EXPRESSION__CALL = {
	name: 'meta.expression.call.cp',
	begin: ['(\\.)', lookaheads([[OWS, '(<|\\()'].join('')])].join(''),
	end:   lookbehinds(['\\)']),
	beginCaptures: {
		1: {name: 'keyword.operator.punctuation.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#GenericArguments'},
		{include: '#Arguments'},
	],
};


export const EXPRESSION__ACCESS = {
	patterns: [
		{
			name: 'meta.expression.access.cp',
			begin: ['(\\.|\\?\\.|\\!\\.)', lookaheads([[OWS, '\\['].join('')])].join(''),
			end:   lookbehinds(['\\]']),
			beginCaptures: {
				1: {name: 'keyword.operator.punctuation.cp'},
			},
			patterns: [
				{include: '#Expression'},
			],
		},
		{
			name: 'meta.expression.access.cp',
			begin: ['(\\.|\\?\\.|\\!\\.)', lookaheads([`${ OWS }(${ INT }|${ VAR })`])].join(''),
			end:   lookbehinds(['[A-Za-z0-9_]', '`']),
			beginCaptures: {
				1: {name: 'keyword.operator.punctuation.cp'},
			},
			patterns: [
				{include: '#Number'},
				identifier('variable.other'),
			],
		},
	],
};


export const EXPRESSION__STRUCTURE__GROUPING = {
	name: 'meta.expression.structure.grouping.cp',
	begin: '\\(',
	end:   '\\)',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#PossibleParameter'},
		{include: '#Expression'},
	],
};


export const EXPRESSION__STRUCTURE__LIST = list('meta.expression.structure.list.cp', '\\[', '\\]', [
	{
		name: 'keyword.other.spread.cp',
		match: '##|#',
	},
	{
		name: 'punctuation.separator.cp',
		match: '\\|->',
	},
	propertyOrArgumentLabel('\\]', '#IdentifierProperty', '#DestructureProperty'),
	{include: '#Expression'}, // must come after property destructuring because of untyped lambda parameters
]);


export const EXPRESSION = {
	patterns: [
		{
			name: 'keyword.operator.punctuation.cp',
			match: '===|!==|<=|>=|!<|!>|==|!=|&&|!&|\\|\\||!\\||\\^|\\*|\\/|~',
		},
		{
			name: 'keyword.operator.text.cp',
			match: '\\b(is|isnt|if|then|else)\\b',
		},
		{
			name: 'variable.language.cp',
			match: '\\b(this)\\b',
		},
		{
			// for cases like `(x: int): {int} => x + 1;` where the `}` incorrectly ends the function
			name: 'storage.type.cp',
			match: ARROW,
		},
		{include: '#ExpressionFunction'},
		{include: '#ExpressionClass'},
		{include: '#ExpressionCall'},
		{include: '#ExpressionAccess'},
		{include: '#ExpressionStructureGrouping'},
		{include: '#ExpressionStructureList'},
		{include: '#Block'}, // serves as '#ExpressionStructurePromise'
		unit(),
		{
			name: 'keyword.operator.punctuation.cp',
			match: `
				< | >      # must come after '#ExpressionFunction'
				| ! | \\?  # must come after '#ExpressionAccess'
				| \\+ | -  # must come after 'unit'
			`.replace(/\#.*\n|\s+/g, ''),
		},
	],
};
