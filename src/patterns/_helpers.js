import {
	lookaheads,
} from '../helpers.js';
import {
	OWS,
	VAR,
	ANNO_START,
	ASSN_START,
	ARROW,
	DESTRUCTURE_PROPERTIES_OR_ARGUMENTS,
} from '../selectors.js';



export function identifier(varname = 'variable.other') {
	return {
		patterns: [
			{include: '#CommentBlock'},
			{include: '#CommentLine'},
			{
				name: `${ varname }.quoted.cp`,
				begin: '`',
				end:   '`',
				captures: {
					0: {name: 'punctuation.delimiter.cp'},
				},
			},
			{
				name: `${ varname }.cp`,
				match: '\\b[A-Za-z_][A-Za-z0-9_]*\\b',
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
			{include: '#Keyword'},
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


export function annotation(end) {
	return {
		name: 'meta.annotation.cp',
		begin: ANNO_START,
		end,
		beginCaptures: {
			0: {name: 'punctuation.delimiter.cp'},
		},
		patterns: [
			{include: '#Type'},
		],
	};
}


export function assignment(end, kind = '#Expression') {
	return {
		name: 'meta.assignment.cp',
		begin: ASSN_START,
		end,
		beginCaptures: {
			0: {name: 'punctuation.delimiter.cp'},
		},
		patterns: [
			{include: kind},
		],
	};
}


export function implicitReturn() {
	return {
		begin: ARROW,
		end:   lookaheads([';']),
		beginCaptures: {
			0: {name: 'storage.type.cp'},
		},
		patterns: [
			{include: '#Expression'},
		],
	};
}


export function propertyOrArgumentLabel(close_delim, identifier_kind, destructure_kind) {
	return {
		patterns: [
			{
				begin: lookaheads([[VAR, OWS, `(\\$|${ ASSN_START })`].join('')]),
				end:   lookaheads([',', close_delim]),
				patterns: [
					{include: identifier_kind},
					assignment(lookaheads([',', close_delim])),
					{
						name: 'keyword.other.alias.cp',
						match: '\\$',
					},
				],
			},
			{
				begin: lookaheads([
					[DESTRUCTURE_PROPERTIES_OR_ARGUMENTS, OWS, ASSN_START].join(''),
				]),
				end: lookaheads([',', close_delim]),
				patterns: [
					{include: destructure_kind},
					assignment(lookaheads([',', close_delim])),
				],
			},
		],
	};
}


export function destructure(subtype, identifiers, param_or_var = false) {
	return list(`meta.destructure.${ subtype.toLowerCase() }.cp`, '\\(', '\\)', [
		{include: `#Destructure${ subtype }`},
		{
			begin: lookaheads([[VAR, OWS, '\\b(as)\\b'].join('')]),
			end:   '\\b(as)\\b',
			endCaptures: {
				0: {name: 'keyword.other.alias.cp'}
			},
			patterns: [
				{include: '#IdentifierProperty'},
			],
		},
		{
			name: 'keyword.other.alias.cp',
			match: '\\$',
		},
		(param_or_var) ? {
			name: 'storage.modifier.cp',
			match: '\\b(unfixed)\\b',
		} : {},
		(param_or_var) ? annotation(lookaheads([',', '\\)'])) : {},
		// // if adding destructure defaults:
		// annotation(lookaheads([ASSN_START, ',', '\\)'])),
		// assignment(lookaheads([',', '\\)'])),
		identifiers,
	]);
}


export function control(begin_keywords, contain_keywords) {
	return {
		name: 'meta.control.cp',
		begin: `\\b(${ begin_keywords.join('|') })\\b`,
		end:   ';',
		beginCaptures: {
			0: {name: 'keyword.control.cp'},
		},
		endCaptures: {
			0: {name: 'punctuation.delimiter.cp'},
		},
		patterns: [
			{
				name: 'keyword.control.cp',
				match: `\\b(${ contain_keywords.join('|') })\\b`,
			},
			{include: '#Expression'},
			{include: '#Block'},
		],
	};
}
