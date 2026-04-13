import {
	pattern_name,
	lookaheads,
	R,
} from '../helpers.ts';
import {
	DELIMS,
	OWS,
	VAR,
	PUN,
	OPT,
	CONSTRAINT,
	IMPL,
	ANNO_START,
	ASSN_START,
	FATARROW,
} from '../selectors.ts';



export function keyword(varname = 'variable.language') {
	return {
		patterns: [
			{
				name: pattern_name('storage.modifier'),
				match: R.w('void'),
			},
			{
				name: pattern_name('constant.language'),
				match: R.w(R.c('null', 'false', 'true')),
			},
			{
				name: pattern_name('support.type'),
				match: R.w(R.c('nothing', 'bool', 'sym', 'int', 'nat', 'float', 'dec', 'str', 'anything')),
			},
			{
				name: pattern_name(varname),
				match: R.w(R.c('this', 'static')),
			},
			{
				name: pattern_name('variable.language'),
				match: R.w(R.c('super', 'method')),
			},
			{
				name: pattern_name('support.class'),
				match: R.w(R.c('Object', 'Class', 'List', 'Dict', 'Set', 'Map')),
			},
		],
	};
}


export function identifier(varname = 'variable.other', allow_blank = false) {
	return {
		patterns: [
			{include: '#CommentBlock'},
			{include: '#CommentLine'},
			{
				name: pattern_name(`${ varname }.quoted.single`),
				begin: '\'',
				end:   '\'',
				captures: {
					0: {name: pattern_name('punctuation.delimiter')},
				},
			},
			{
				name: pattern_name(varname),
				match: R.w(`[A-Za-z][A-Za-z0-9_]*|_[A-Za-z0-9_]${ allow_blank ? '*' : '+' }`),
			},
			{
				/* Invalid blank variable used as a reference. */
				name: pattern_name('invalid.illegal'),
				match: '(?<=\\b)_(?=\\b)',
			},
		],
	}
}


export function qualified_name(varname = 'variable.other') {
	return {
		patterns: [
			identifier(varname),
			{
				name:  pattern_name('punctuation.separator.namespace'),
				match: '::',
			},
		],
	};
}


export function unit(varname = 'variable.other') {
	return {
		patterns: [
			{include: '#Template'},
			{include: '#String'},
			{include: '#Number'},
			{include: '#Symbol'},
			(varname === 'entity.name.type' ? keyword('support.type') : keyword()),
			qualified_name(varname),
			{
				/*
				 * Invalid underscores in number literals.
				 * Must come after variables so that they can be lexed correctly.
				 */
				name: pattern_name('invalid.illegal'),
				match: '__|_(?=\\b)',
			},
		],
	};
}


export function list(name: string, begin: string, end: string, more_patterns: readonly object[]) {
	return {
		name,
		begin,
		end,
		captures: {
			0: {name: pattern_name('punctuation.delimiter')},
		},
		patterns: [
			{
				name: pattern_name('punctuation.separator'),
				match: ',',
			},
			...more_patterns,
		],
	};
}


export function param_label(prop_delim: string, identifier_kind: string) {
	return {
		name:        pattern_name('meta.label'),
		begin:       lookaheads([R.s(VAR, OWS, prop_delim)]),
		end:         prop_delim,
		endCaptures: {0: {name: pattern_name('punctuation.delimiter')}},
		patterns:    [{include: identifier_kind}],
	};
}


export function constraint(end: string) {
	return {
		name:  pattern_name('meta.heritage'),
		begin: CONSTRAINT,
		end,
		beginCaptures: {
			0: {name: pattern_name('storage.modifier')},
		},
		patterns: [
			{include: '#Type'},
		],
	};
}


export function annotation(end: string, fn_ret_annot = false) {
	return {
		name: pattern_name('meta.annotation'),
		begin: ANNO_START,
		end,
		beginCaptures: {
			0: {name: pattern_name('punctuation.delimiter')},
		},
		patterns: [
			{include: fn_ret_annot ? '#Typefnret' : '#Type'},
		],
	};
}


export function assignment(begin: string, end: string, include = '#Expression') {
	return {
		name: pattern_name('meta.assignment'),
		begin,
		end,
		beginCaptures: {
			0: {name: pattern_name('punctuation.delimiter')},
		},
		patterns: [
			{include},
		],
	};
}


export function func_heritage(end: string) {
	return {
		name:  pattern_name('meta.heritage'),
		begin: IMPL,
		end,
		beginCaptures: {0: {name: pattern_name('storage.modifier')}},
		patterns: [
			{include: '#TypeAccess'},
			{include: '#TypeCall'},
			qualified_name('entity.other.inherited-class'),
		],
	};
}


export function implicitReturn(include = '#Expression') {
	return {
		name: pattern_name('meta.implicitreturn'),
		begin: FATARROW,
		end:   lookaheads([';']),
		beginCaptures: {
			0: {name: pattern_name('storage.type')},
		},
		patterns: [
			{include},
		],
	};
}


export function destructure(subtype: string, identifiers: object) {
	const prop_delim = (
		['Variable', 'Parameter', 'Property', 'Argument', 'Assignment'].includes(subtype)      ? ASSN_START :
		['TypeAlias', 'GenericParameter', 'TypeProperty', 'GenericArgument'].includes(subtype) ? ANNO_START :
		ASSN_START
	);
	return list(pattern_name(`meta.destructure.${ subtype.toLowerCase() }`), DELIMS.DESTRUCT[0], DELIMS.DESTRUCT[1], [
		{include: `#Destructure${ subtype }`},
		param_label(prop_delim, '#IdentifierProperty'),
		{
			name: pattern_name('keyword.other.alias'),
			match: PUN,
		},
		{
			name:  pattern_name('keyword.other.optional'),
			match: OPT,
		},
		...(['Variable', 'Parameter'].includes(subtype) ? [
			...(subtype === 'Variable' ? [
				{include: '#ModifiersDeclarationVariable'},
			] : [
				{include: '#ModifiersParameter'},
			]),
			annotation(lookaheads([ASSN_START, ',', DELIMS.DESTRUCT[1]])),
			assignment(ASSN_START, lookaheads([',', DELIMS.DESTRUCT[1]])),
		] : []),
		...(['TypeAlias', 'GenericParameter'].includes(subtype) ? [
			...(subtype === 'TypeAlias' ? [
				{include: '#ModifiersDeclarationType'},
			] : [
				{include: '#ModifiersGenericParameter'},
			]),
			constraint(lookaheads([ASSN_START, ',', DELIMS.DESTRUCT[1]])),
			assignment(ASSN_START, lookaheads([',', DELIMS.DESTRUCT[1]]), '#Type'),
		] : []),
		identifiers,
	]);
}
