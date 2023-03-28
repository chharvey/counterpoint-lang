import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
	INT,
	VAR,
	ANNO_START,
	THINARROW,
	FATARROW,
	BLOCK_END,
} from '../selectors.js';
import {
	identifier,
	unit,
	list,
	annotation,
} from './_helpers.js';



export const TYPE_CALL = {
	name: 'meta.type.call.cp',
	begin: ['(\\.)', lookaheads([[OWS, DELIMS.ARGS_GN[0]].join('')])].join(''),
	end:   lookbehinds([DELIMS.ARGS_GN[1]]),
	beginCaptures: {
		1: {name: 'keyword.operator.punctuation.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#GenericArguments'},
	],
};


export const TYPE__ACCESS = {
	name: 'meta.type.access.cp',
	begin: ['(\\.)', lookaheads([`${ OWS }(${ INT }|${ VAR })`])].join(''),
	end:   lookbehinds(['[A-Za-z0-9_`]']),
	beginCaptures: {
		1: {name: 'keyword.operator.punctuation.cp'},
	},
	patterns: [
		{include: '#Number'},
		identifier('variable.other', true),
	],
};


export const TYPE__STRUCTURE__GROUPING = {
	name: 'meta.type.structure.grouping.cp',
	begin: DELIMS.GROUPING[0],
	end:   DELIMS.GROUPING[1],
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#PossibleTypeParameter'},
		{include: '#Type'},
	],
};


export const TYPE__STRUCTURE__LIST = list('meta.type.structure.list.cp', DELIMS.LIST[0], DELIMS.LIST[1], [
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


export const TYPE__STRUCTURE__SET = list('meta.type.structure.set.cp', DELIMS.SET[0], BLOCK_END, [
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


export const TYPENONFUNCTION = {
	patterns: [
		{
			name: 'keyword.operator.punctuation.cp',
			match: '!|\\?|~~|\\*|\\/|&|\\||\\^',
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
		{include: '#TypeInterface'},
		{include: '#TypeCall'},
		{include: '#TypeAccess'},
		{include: '#TypeStructureGrouping'},
		{include: '#TypeStructureList'},
		{include: '#TypeStructureSet'},
		unit('entity.name.type'),
	],
};


export const TYPE = {
	patterns: [
		{include: '#TypeFunction'}, // must come before `unit` so `async` and `gen` keywords are marked correctly
		{include: '#Typenonfunction'},
	],
};
