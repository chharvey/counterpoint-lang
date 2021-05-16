import {
	lookaheads,
} from '../helpers.js';
import {
	OWS,
	VAR,
	ANNO_START,
	ASSN_START,
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


export function annotation(end, optional_allowed = false) {
	return {
		name: 'meta.annotation.cp',
		begin: ((optional_allowed) ? '\\??' : '').concat(ANNO_START),
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


export function destructure(subtype, identifiers, annot = false) {
	return {
		name: `meta.destructure.${ subtype.toLowerCase() }.cp`,
		begin: '\\(',
		end:   '\\)',
		captures: {
			0: {name: 'punctuation.delimiter.cp'},
		},
		patterns: [
			{
				name: 'punctuation.separator.cp',
				match: ',',
			},
			{
				begin: lookaheads([`${ VAR }${ OWS }\\b(as)\\b`]),
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
			{include: `#Destructure${ subtype }`},
			(annot) ? annotation(lookaheads([',', '\\)'])) : {},
			// // if adding destructure defaults:
			// annotation(lookaheads([ASSN_START, ',', '\\)'])),
			// assignment(lookaheads([',', '\\)'])),
			identifiers,
		],
	};
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
