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



export const GENERIC_ARGUMENTS = list(pattern_name('meta.genericarguments'), DELIMS.ARGS_GN[0], DELIMS.ARGS_GN[1], [
	{
		name: pattern_name('keyword.other.spread'),
		match: '##|#',
	},
	genericArgumentLabel(DELIMS.ARGS_GN[1]),
	{include: '#Type'}, // must come after `genericArgumentLabel` because we don’t want types to look like named arguments
]);


export const TYPE_CALL = {
	name: pattern_name('meta.type.call'),
	begin: [DOT, lookaheads([[OWS, DELIMS.ARGS_GN[0]].join('')])].join(''),
	end:   lookbehinds([DELIMS.ARGS_GN[1]]),
	beginCaptures: {
		1: {name: pattern_name('keyword.operator.punctuation')},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#GenericArguments'},
	],
};


export const TYPE__ACCESS = {
	name: pattern_name('meta.type.access'),
	begin: [DOT_ACCESS, lookaheads([[OWS, `(${ INT }|${ VAR })`].join('')])].join(''),
	end:   lookbehinds(['[A-Za-z0-9_\']']),
	beginCaptures: {
		1: {name: pattern_name('keyword.operator.punctuation')},
	},
	patterns: [
		{include: '#Number'},
		identifier('variable.other', true),
	],
};


export const TYPE__STRUCTURE__GROUPING = list(pattern_name('meta.type.structure.grouping_or_tuple'), DELIMS.GROUPING[0], DELIMS.GROUPING[1], [
	{
		name: pattern_name('keyword.other.spread'),
		match: '##|#',
	},
	typeProperty(DELIMS.GROUPING[1]),
	{include: '#Type'}, // must come after `typeProperty` because we don’t want types to look like record keys
]);


export const TYPE__STRUCTURE__LIST = {
	name:     pattern_name('meta.type.structure.list'),
	begin:    DELIMS.LIST[0],
	end:      DELIMS.LIST[1],
	captures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		typeProperty(DELIMS.LIST[1]),
		{include: '#Type'}, // must come after `typeProperty` because we don’t want types to look like dict keys
	],
};


export const TYPE__STRUCTURE__SET = {
	name:     pattern_name('meta.type.structure.set'),
	begin:    DELIMS.SET[0],
	end:      DELIMS.SET[1],
	captures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{
			name: pattern_name('keyword.operator.punctuation'),
			match: THINARROW,
		},
		{include: '#Type'},
	],
};


export const TYPEFNRET = {
	patterns: [
		{
			name: pattern_name('keyword.operator.punctuation'),
			match: `~~|[!^*/&|]`,
		},
		{
			name: pattern_name('keyword.operator.text'),
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
			name: pattern_name('keyword.operator.punctuation'),
			match: '\\?', // must come after '#TypeAccess'
		},
	],
};


export const TYPE = {
	patterns: [
		{include: '#Typefnret'},
		{include: '#TypeStructureSet'},
	],
};
