import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	OWS,
	VAR,
	ANNO_START,
	THINARROW,
	FATARROW,
	BLOCK_END,
} from '../selectors.js';
import {
	unit,
	list,
	annotation,
} from './_helpers.js';



export const TYPE_CALL = {
	name: 'meta.type.call.cp',
	begin: ['(\\.)', lookaheads([[OWS, '<'].join('')])].join(''),
	end:   lookbehinds(['>']),
	beginCaptures: {
		1: {name: 'keyword.operator.punctuation.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#GenericArguments'},
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
		name: 'keyword.other.spread.cp',
		match: '##|#',
	},
	{
		begin: lookaheads([`(${ VAR }${ OWS })?${ ANNO_START }`]),
		end:   lookaheads([',', '\\]']),
		patterns: [
			{include: '#IdentifierProperty'},
			annotation(lookaheads([',', '\\]'])),
		],
	},
	{include: '#Type'}, // must come after annotations because of record type keys
]);


export const TYPE__STRUCTURE__SET = list('meta.type.structure.set.cp', '\\{', BLOCK_END, [
	{
		name: 'keyword.other.spread.cp',
		match: '#',
	},
	{
		name: 'keyword.operator.punctuation.cp',
		match: THINARROW,
	},
	{include: '#Type'},
]);


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
		{
			// for cases like `type T = (
			// 	x: int,
			// ) => int`
			name: 'keyword.operator.punctuation.cp',
			match: FATARROW,
		},
		{include: '#TypeFunction'},
		{include: '#TypeInterface'},
		{include: '#TypeCall'},
		{include: '#TypeStructureGrouping'},
		{include: '#TypeStructureList'},
		{include: '#TypeStructureSet'},
		unit('entity.name.type'),
	],
};
