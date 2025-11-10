import {
	pattern_name,
	lookaheads,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
	VAR,
	UNFIXED,
	PUN,
	CONSTRAINT,
	ANNO_START,
	ASSN_START,
	DFLT_START,
	FATARROW,
	DESTRUCTURE_TYPE_PROPERTIES_OR_GENERIC_ARGUMENTS,
	DESTRUCTURE_PROPERTIES_OR_ARGUMENTS,
} from '../selectors.js';



export function keyword(varname = 'variable.language') {
	return {
		patterns: [
			{
				name: pattern_name('storage.modifier'),
				match: '\\b(void)\\b',
			},
			{
				name: pattern_name('constant.language'),
				match: '\\b(null|false|true)\\b',
			},
			{
				name: pattern_name('support.type'),
				match: '\\b(nothing|bool|sym|nat|int|float|dec|str|anything)\\b',
			},
			{
				name: pattern_name(varname),
				match: '\\b(this|static)\\b',
			},
			{
				name: pattern_name('variable.language'),
				match: '\\b(super|method)\\b',
			},
			{
				name: pattern_name('support.class'),
				match: '\\b(Object|Class|List|Dict|Set|Map)\\b',
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
				match: `\\b[A-Za-z][A-Za-z0-9_]*|_[A-Za-z0-9_]${ allow_blank ? '*' : '+' }\\b`,
			},
			{
				/* Invalid blank variable used as a reference. */
				name: pattern_name('invalid.illegal'),
				match: '(?<=\\b)_(?=\\b)',
			},
		],
	}
}


export function unit(varname = 'variable.other') {
	return {
		patterns: [
			{include: '#Template'},
			{include: '#String'},
			{include: '#Number'},
			{include: '#Symbol'},
			(varname === 'entity.name.type' ? keyword('support.type') : keyword()),
			identifier(varname),
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


export function list(name, begin, end, more_patterns) {
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


export function constraint(end) {
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


export function annotation(end, fn_ret_annot = false) {
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


export function assignment(begin, end, include = '#Expression') {
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


function typePropertyOrGenericArgumentLabel(start, close_delim, identifier_kind, destructure_kind) {
	const end = lookaheads([',', close_delim]);
	const capture_type = (
		start === ANNO_START ? annotation(end) :
		start === ASSN_START ? assignment(ASSN_START, end, '#Type') :
		{}
	);
	return {
		patterns: [
			{
				begin: lookaheads([[`(${ VAR }${ OWS })?`, `(${ PUN }|${ start })`].join('')]),
				end,
				patterns: [
					{include: identifier_kind},
					{
						name: pattern_name('keyword.other.alias'),
						match: PUN,
					},
					capture_type,
				],
			},
			{
				begin: lookaheads([[DESTRUCTURE_TYPE_PROPERTIES_OR_GENERIC_ARGUMENTS, OWS, start].join('')]),
				end,
				patterns: [
					{include: destructure_kind},
					capture_type,
				],
			},
		],
	};
}
export function typeProperty(close_delim) {
	return typePropertyOrGenericArgumentLabel(ANNO_START, close_delim, '#IdentifierProperty', '#DestructureTypeProperty');
}
export function genericArgumentLabel(close_delim) {
	return typePropertyOrGenericArgumentLabel(ASSN_START, close_delim, '#IdentifierParameter', '#DestructureGenericArgument');
}


function propertyOrArgumentLabel(close_delim, identifier_kind, destructure_kind) {
	const end = lookaheads([',', close_delim]);
	const capture_expression = assignment(ASSN_START, end);
	return {
		patterns: [
			{
				begin: lookaheads([[VAR, OWS, `(${ PUN }|${ ASSN_START })`].join('')]),
				end,
				patterns: [
					{include: identifier_kind},
					{
						name: pattern_name('keyword.other.alias'),
						match: PUN,
					},
					capture_expression,
				],
			},
			{
				begin: lookaheads([[DESTRUCTURE_PROPERTIES_OR_ARGUMENTS, OWS, ASSN_START].join('')]),
				end,
				patterns: [
					{include: destructure_kind},
					capture_expression,
				],
			},
		],
	};
}
export function property(close_delim) {
	return propertyOrArgumentLabel(close_delim, '#IdentifierProperty', '#DestructureProperty');
}
export function argumentLabel(close_delim) {
	return propertyOrArgumentLabel(close_delim, '#IdentifierParameter', '#DestructureArgument');
}


export function destructure(subtype, identifiers) {
	const prop_delim = (
		['Variable', 'Parameter', 'Property', 'Argument', 'Assignment'].includes(subtype)      ? ASSN_START :
		['TypeAlias', 'GenericParameter', 'TypeProperty', 'GenericArgument'].includes(subtype) ? ANNO_START :
		ASSN_START
	);
	return list(pattern_name(`meta.destructure.${ subtype.toLowerCase() }`), DELIMS.DESTRUCT[0], DELIMS.DESTRUCT[1], [
		{include: `#Destructure${ subtype }`},
		{
			begin:       lookaheads([[VAR, OWS, prop_delim].join('')]),
			end:         prop_delim,
			endCaptures: {
				0: {name: pattern_name('punctuation.delimiter')}
			},
			patterns: [
				{include: '#IdentifierProperty'},
			],
		},
		{
			name: pattern_name('keyword.other.alias'),
			match: PUN,
		},
		...(['Variable', 'Parameter'].includes(subtype) ? [
			...(subtype === 'Variable' ? [
				{include: '#ModifiersDeclarationLet'},
			] : [
				{include: '#ModifiersParameter'},
			]),
			annotation(lookaheads([DFLT_START, ',', DELIMS.DESTRUCT[1]])),
			assignment(DFLT_START, lookaheads([',', DELIMS.DESTRUCT[1]])),
		] : []),
		...(['TypeAlias', 'GenericParameter'].includes(subtype) ? [
			...(subtype === 'TypeAlias' ? [
				{include: '#GenericParameters'},
				{include: '#ModifiersDeclarationType'},
			] : [
				{include: '#ModifiersGenericParameter'},
			]),
			constraint(lookaheads([DFLT_START, ',', DELIMS.DESTRUCT[1]])),
			assignment(DFLT_START, lookaheads([',', DELIMS.DESTRUCT[1]]), '#Type'),
		] : []),
		identifiers,
	]);
}
