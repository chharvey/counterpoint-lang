import {
	pattern_name,
	lookaheads,
	lookbehinds,
	R,
} from '../helpers.ts';
import {
	DELIMS,
	OWS,
	INT,
	VAR,
	PUN,
	ANNO_START,
	ASSN_START,
	MUTABLE,
	THINARROW,
	DOT_ACCESS,
	destructure_selector,
} from '../selectors.ts';
import {
	identifier,
	unit,
	list,
	label,
	annotation,
	assignment,
} from './_helpers.ts';



function type_argument_or_property(end: string, destructure_kind: string, identifier_kind: string, label_delim: string) {
	const label_value = (
		label_delim === ANNO_START ? annotation(end) :
		label_delim === ASSN_START ? assignment(end, true) :
		{}
	);
	return [
		{
			end,
			begin:    lookaheads([R.s(destructure_selector(ANNO_START), OWS, label_delim)]), // need to include `label_delim`, otherwise could be grouping/tuple/record
			patterns: [
				{include: destructure_kind},
				label_value,
			],
		},
		{
			end,
			begin:         PUN,
			beginCaptures: {0: {name: pattern_name('keyword.other.alias')}},
			patterns:      [{include: identifier_kind}],
		},
		label(label_delim, identifier_kind),
		label_value,
		{
			name: pattern_name('keyword.other.spread'),
			match: '##|#',
		},
		{include: '#Type'},
	];
}


export const GENERIC_ARGUMENTS = list(pattern_name('meta.genericarguments'), DELIMS.ARGS_GN[0], DELIMS.ARGS_GN[1], type_argument_or_property(
	lookaheads([',', DELIMS.ARGS_GN[1]]),
	'#DestructureGenericArgument',
	'#IdentifierParameter',
	ASSN_START,
));


export const TYPE__ACCESS = {
	name: pattern_name('meta.type.access'),
	begin: R.s(R.g(DOT_ACCESS)),
	end:   lookbehinds(['[A-Za-z0-9_\']']),
	beginCaptures: {
		1: {name: pattern_name('keyword.operator.punctuation')},
	},
	patterns: [
		{include: '#Number'},
		identifier('variable.other', true),
	],
};


export const TYPE_CALL = {
	name:  pattern_name('meta.type.call'),
	begin: R.s(
		lookbehinds([R.s(R.c(
			'[A-Za-z0-9_?!^*]|~~',
			DELIMS.GROUPING[1],
			DELIMS.LIST[1],
			'\\}', // DELIMS.SET[1],
			DELIMS.ARGS_GN[1],
		), OWS)]),
		lookaheads([DELIMS.ARGS_GN[0]]),
	),
	end:      R.s(lookbehinds([DELIMS.ARGS_GN[1]]), lookaheads([DELIMS.ARGS_GN[0]], true)),
	patterns: [{include: '#GenericArguments'}],
};


export const TYPE__STRUCTURE__GROUPING = list(pattern_name('meta.type.structure.grouping_or_tuple'), DELIMS.GROUPING[0], DELIMS.GROUPING[1], type_argument_or_property(
	lookaheads([',', DELIMS.GROUPING[1]]),
	'#DestructureTypeProperty',
	'#IdentifierProperty',
	ANNO_START,
));


export const TYPE__STRUCTURE__LIST = list(pattern_name('meta.type.structure.list'), DELIMS.LIST[0], DELIMS.LIST[1], type_argument_or_property(
	lookaheads([',', DELIMS.LIST[1]]),
	'#DestructureTypeProperty',
	'#IdentifierProperty',
	ANNO_START,
));


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
			match: '~~|[?!^*/&|]',
		},
		{
			name: pattern_name('keyword.operator.text'),
			match: MUTABLE,
		},
		{include: '#TypeFunction'},
		{include: '#TypeInterface'},
		{include: '#TypeAccess'},
		{include: '#TypeCall'},
		{include: '#TypeStructureGrouping'},
		{include: '#TypeStructureList'},
		unit(true),
	],
};


export const TYPE = {
	patterns: [
		{include: '#Typefnret'},
		{include: '#TypeStructureSet'},
	],
};
