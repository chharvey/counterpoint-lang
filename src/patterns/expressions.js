import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	OWS,
	INT,
	VAR,
	ASSN_START,
	DESTRUCTURE_PROPERTIES_OR_ARGUMENTS,
} from '../selectors.js';
import {
	identifier,
	unit,
	list,
	assignment,
} from './_helpers.js';



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
			begin: ['(\\.)', lookaheads([[OWS, '\\['].join('')])].join(''),
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
			begin: ['(\\.)', lookaheads([`${ OWS }(${ INT }|${ VAR })`])].join(''),
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
			name: 'punctuation.separator.cp',
			match: '\\|->',
		},
		{
			begin: lookaheads([[VAR, OWS, '\\$'].join('')]),
			end:   lookaheads([',', '\\]']),
			patterns: [
				{include: '#IdentifierProperty'},
				{
					name: 'keyword.other.alias.cp',
					match: '\\$',
				},
			],
		},
		{
			begin: lookaheads([
				[`(${ VAR }|${ DESTRUCTURE_PROPERTIES_OR_ARGUMENTS })`, OWS, ASSN_START].join(''),
			]),
			end: lookaheads([',', '\\]']),
			patterns: [
				{include: '#IdentifierProperty'},
				{include: '#DestructureProperty'},
				assignment(lookaheads([',', '\\]'])),
			],
		},
		{
			name: 'keyword.other.spread.cp',
			match: '##|#',
		},
		{include: '#Expression'},
]);


export const EXPRESSION = {
	patterns: [
		{
			name: 'keyword.operator.punctuation.cp',
			match: '<=|>=|!<|!>|==|!=|&&|!&|\\|\\||!\\||!|\\?|\\+|-|\\^|\\*|\\/|<|>|~',
		},
		{
			name: 'keyword.operator.text.cp',
			match: '\\b(is|isnt|if|then|else)\\b',
		},
		{
			name: 'variable.language.cp',
			match: '\\b(this)\\b',
		},
		{include: '#ExpressionFunction'},
		{include: '#ExpressionClass'},
		{include: '#ExpressionCall'},
		{include: '#ExpressionAccess'},
		{include: '#ExpressionStructureGrouping'},
		{include: '#ExpressionStructureList'},
		unit(),
	],
};
