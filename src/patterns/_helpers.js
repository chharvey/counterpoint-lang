import {
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
				name: 'storage.modifier.cp',
				match: '\\b(void)\\b',
			},
			{
				name: 'constant.language.cp',
				match: '\\b(null|false|true)\\b',
			},
			{
				name: 'support.type.cp',
				match: '\\b(never|bool|int|float|str|unknown)\\b',
			},
			{
				name:  `${ varname }.cp`,
				match: '\\b(this)\\b',
			},
			{
				name: 'variable.language.cp',
				match: '\\b(super|method)\\b',
			},
			{
				name: 'support.class.cp',
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
				name: `${ varname }.quoted.single.cp`,
				begin: '\'',
				end:   '\'',
				captures: {
					0: {name: 'punctuation.delimiter.cp'},
				},
			},
			{
				name: `${ varname }.cp`,
				match: `\\b[A-Za-z][A-Za-z0-9_]*|_[A-Za-z0-9_]${ allow_blank ? '*' : '+' }\\b`,
			},
			{
				/* Invalid blank variable used as a reference. */
				name: 'invalid.illegal.cp',
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
			(varname === 'entity.name.type' ? keyword('support.type') : keyword()),
			identifier(varname),
			{
				/*
				 * Invalid underscores in number literals.
				 * Must come after variables so that they can be lexed correctly.
				 */
				name: 'invalid.illegal.cp',
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
			0: {name: 'punctuation.delimiter.cp'},
		},
		patterns: [
			{
				name: 'punctuation.separator.cp',
				match: ',',
			},
			...more_patterns,
		],
	};
}


export function constraint(end) {
	return {
		name:  'meta.heritage.cp',
		begin: CONSTRAINT,
		end,
		beginCaptures: {
			0: {name: 'storage.modifier.cp'},
		},
		patterns: [
			{include: '#Type'},
		],
	};
}


export function annotation(end, allow_function_type = true) {
	return {
		name: 'meta.annotation.cp',
		begin: ANNO_START,
		end,
		beginCaptures: {
			0: {name: 'punctuation.delimiter.cp'},
		},
		patterns: [
			{include: (allow_function_type) ? '#Type' : '#Typenonfunction'},
		],
	};
}


export function assignment(begin, end, include = '#Expression') {
	return {
		name: 'meta.assignment.cp',
		begin,
		end,
		beginCaptures: {
			0: {name: 'punctuation.delimiter.cp'},
		},
		patterns: [
			{include},
		],
	};
}


export function implicitReturn(include = '#Expression') {
	return {
		name: 'meta.implicitreturn.cp',
		begin: FATARROW,
		end:   lookaheads([';']),
		beginCaptures: {
			0: {name: 'storage.type.cp'},
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
						name: 'keyword.other.alias.cp',
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
						name: 'keyword.other.alias.cp',
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
	return list(`meta.destructure.${ subtype.toLowerCase() }.cp`, DELIMS.DESTRUCT[0], DELIMS.DESTRUCT[1], [
		{include: `#Destructure${ subtype }`},
		{
			begin:       lookaheads([[VAR, OWS, prop_delim].join('')]),
			end:         prop_delim,
			endCaptures: {
				0: {name: 'punctuation.delimiter.cp'}
			},
			patterns: [
				{include: '#IdentifierProperty'},
			],
		},
		{
			name: 'keyword.other.alias.cp',
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
