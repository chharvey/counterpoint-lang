import {
	lookaheads,
} from '../helpers.js';
import {
	OWS,
	VAR,
	ANNO_START,
	BLOCK_END,
} from '../selectors.js';
import {
	unit,
	list,
	annotation,
} from './_helpers.js';



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
		name: 'keyword.other.spread.cp',
		match: '##|#',
	},
	{
		begin: lookaheads([[VAR, OWS, ANNO_START].join('')]),
		end:   lookaheads([',', '\\]']),
		patterns: [
			{include: '#IdentifierProperty'},
			annotation(lookaheads([',', '\\]'])),
		],
	},
	{include: '#Type'}, // must come after annotations because of record type keys
]);


export const TYPE__STRUCTURE__PROMISE = {
	name: 'meta.type.structure.promise.cp',
	begin: '\\{',
	end:   BLOCK_END,
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#Type'},
	],
};


export const TYPE = {
	patterns: [
		{
			name: 'keyword.operator.punctuation.cp',
			match: `!|\\?|&|\\|`,
		},
		{
			name: 'keyword.operator.text.cp',
			match: '\\b(mutable)\\b',
		},
		{
			name: 'support.type.cp',
			match: '\\b(this)\\b',
		},
		{include: '#TypeFunction'},
		{include: '#TypeInterface'},
		{include: '#TypeAccess'},
		{include: '#TypeStructureGrouping'},
		{include: '#TypeStructureList'},
		{include: '#TypeStructurePromise'},
		unit('entity.name.type'),
	],
};
