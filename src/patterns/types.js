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
	DOT,
	DOT_ACCESS,
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
	{include: '#GenericParameterPossible'},
	{include: '#Type'}, // must come after `genericArgumentLabel` because we don’t want types to look like named arguments
]);


export const TYPE_CALL = {
	name: 'meta.type.call.cp',
	begin: [DOT, lookaheads([[OWS, DELIMS.ARGS_GN[0]].join('')])].join(''),
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
	begin: [DOT_ACCESS, lookaheads([[OWS, `(${ INT }|${ VAR })`].join('')])].join(''),
	end:   lookbehinds(['[A-Za-z0-9_\']']),
	beginCaptures: {
		1: {name: 'keyword.operator.punctuation.cp'},
	},
	patterns: [
		{include: '#Number'},
		identifier('variable.other', true),
	],
};


export const TYPE__STRUCTURE__GROUPING = list('meta.type.structure.grouping_or_tuple.cp', DELIMS.GROUPING[0], DELIMS.GROUPING[1], [
	{
		name: 'keyword.other.spread.cp',
		match: '##|#',
	},
	typeProperty(DELIMS.GROUPING[1]),
	{include: '#Type'}, // must come after `typeProperty` because we don’t want types to look like record keys
]);


export const TYPE__STRUCTURE__LIST = {
	name:     'meta.type.structure.list.cp',
	begin:    DELIMS.LIST[0],
	end:      DELIMS.LIST[1],
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		typeProperty(DELIMS.LIST[1]),
		{include: '#Type'}, // must come after `typeProperty` because we don’t want types to look like dict keys
	],
};


export const TYPE__STRUCTURE__SET = {
	name:     'meta.type.structure.set.cp',
	begin:    DELIMS.SET[0],
	end:      DELIMS.SET[1],
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'keyword.operator.punctuation.cp',
			match: THINARROW,
		},
		{include: '#Type'},
	],
};


export const TYPEFNRET = {
	patterns: [
		{
			name: 'keyword.operator.punctuation.cp',
			match: `~~|[!^*/&|]`,
		},
		{
			name: 'keyword.operator.text.cp',
			match: MUTABLE,
		},
		{include: '#TypeFunction'},
		{include: '#TypeInterface'},
		{include: '#TypeCall'},
		{include: '#TypeAccess'},
		{include: '#TypeStructureGrouping'},
		{include: '#TypeStructureList'},
		unit('entity.name.type'),
		{
			name: 'keyword.operator.punctuation.cp',
			match: '\\?', // must come after '#TypeAccess'
		},
	],
};


export const TYPE = {
	patterns: [
		{include: '#TypeStructureSet'},
		{include: '#Typefnret'},
	],
};
