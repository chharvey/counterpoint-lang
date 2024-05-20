import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
	INT,
	VAR,
	MUTABLE,
	THINARROW,
	FATARROW,
} from '../selectors.js';
import {
	identifier,
	unit,
	list,
	typeProperty,
	genericArgumentLabel,
} from './_helpers.js';



export const GENERIC_ARGUMENTS = list('meta.genericarguments.cp', DELIMS.ARGS_GN[0], DELIMS.ARGS_GN[1], [
	{
		name: 'keyword.other.spread.cp',
		match: '##|#',
	},
	genericArgumentLabel(DELIMS.ARGS_GN[1]),
	{include: '#Type'}, // must come after `genericArgumentLabel` because we don’t want types to look like named arguments
]);


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
	end:   lookbehinds(['[A-Za-z0-9_\']']),
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
	typeProperty(DELIMS.LIST[1]),
	{include: '#Type'}, // must come after `typeProperty` because we don’t want types to look like record keys
]);


export const TYPE__STRUCTURE__SET = list('meta.type.structure.set.cp', DELIMS.SET[0], DELIMS.SET[1], [
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
			match: MUTABLE,
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
		{include: '#Typenonfunction'},
		{include: '#TypeFunction'},
	],
};
