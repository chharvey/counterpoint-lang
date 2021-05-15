import {
	lookaheads,
} from '../helpers.js';
import {
	OWS,
	VAR,
	ANNO_START,
} from '../selectors.js';
import {
	unit,
	list,
	annotation,
} from './_helpers.js';



export const PROMISE_TYPE = {
	name: 'meta.type.structure.promise.cp',
	begin: '\\{',
	end:   `\\}${ lookaheads(['\\}'], true) }`,
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#Type'},
	],
};


export const TYPE__STRUCTURE__GROUPING = {
	name: 'meta.type.structure.grouping.cp',
	begin: '\\(',
	end:   '\\)',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#PossibleTypeParameter'},
		{include: '#Type'},
	],
};


export const TYPE__STRUCTURE__LIST = list('meta.type.structure.list.cp', '\\[', '\\]', [
		{
			begin: lookaheads([
				[VAR, OWS, ANNO_START].join(''),
			]),
			end: lookaheads([',', '\\]']),
			patterns: [
				annotation(lookaheads([',', '\\]'])),
				{include: '#IdentifierProperty'},
			],
		},
		{
			name: 'keyword.other.spread.cp',
			match: '##|#',
		},
		{include: '#Type'},
]);


export const TYPE = {
	patterns: [
		{
			name: 'keyword.operator.punctuation.cp',
			match: `!|\\?|&|\\|`,
		},
		{include: '#TypeFunction'},
		{include: '#TypeInterface'},
		{include: '#TypeAccess'},
		{include: '#TypeStructureGrouping'},
		{include: '#TypeStructureList'},
		{
			name: 'support.type.cp',
			match: '\\b(this)\\b',
		},
		{include: '#PromiseType'},
		unit('entity.name.type'),
	],
};
