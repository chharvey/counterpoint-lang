import {
	lookaheads,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
	VAR,
	UNFIXED,
	PUN,
	ANNO_START,
	ASSN_START,
	DFLT_START,
	FATARROW,
	DESTRUCTURE_PROPERTIES_OR_ARGUMENTS,
} from '../selectors.js';



export function keyword(varname = 'variable.language') {
	return {
		patterns: [
			{
				name: 'constant.language.cp',
				match: '\\b(null|false|true)\\b',
			},
			{
				name: 'support.type.cp',
				match: '\\b(never|void|bool|int|float|str|unknown)\\b',
			},
			{
				name:  `${ varname }.cp`,
				match: '\\b(this)\\b',
			},
			{
				name: 'variable.language.cp',
				match: '\\b(super|static|hyper|method)\\b',
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


function typePropertyOrGenericArgumentLabel(start, close_delim, identifier_kind) {
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
		],
	};
}
export function typeProperty(close_delim) {
	return typePropertyOrGenericArgumentLabel(ANNO_START, close_delim, '#IdentifierProperty');
}
export function genericArgumentLabel(close_delim) {
	return typePropertyOrGenericArgumentLabel(ASSN_START, close_delim, '#IdentifierParameter');
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


export function destructure(subtype, identifiers, param_or_var = false) {
	return list(`meta.destructure.${ subtype.toLowerCase() }.cp`, DELIMS.DESTRUCT[0], DELIMS.DESTRUCT[1], [
		{include: `#Destructure${ subtype }`},
		{
			begin: lookaheads([[VAR, OWS, ASSN_START].join('')]),
			end:   ASSN_START,
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
		...((param_or_var) ? [
			{
				name: 'storage.modifier.cp',
				match: UNFIXED,
			},
			annotation(lookaheads([DFLT_START, ',', DELIMS.DESTRUCT[1]])),
			assignment(DFLT_START, lookaheads([',', DELIMS.DESTRUCT[1]])),
		] : []),
		identifiers,
	]);
}
