import {
	lookaheads,
} from './helpers.js';
import {
	ANNO_START,
	ASSN_START,
} from './selectors.js';



export function unit(varname = 'variable.other') {
	return {
		patterns: [
			{include: '#CommentBlock'},
			{include: '#CommentLine'},
			{include: '#Template'},
			{include: '#String'},
			{
				name: `${ varname }.quoted.cp`,
				begin: '`',
				end:   '`',
				captures: {
					0: {name: 'punctuation.delimiter.cp'},
				},
			},
			{include: '#Number'},
			{include: '#Keyword'},
			{
				name: `${ varname }.cp`,
				match: '\\b[A-Za-z_][A-Za-z0-9_]*\\b',
			},
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


export function destructure(varname, annot = false) {
	return {
		name: 'meta.destructure.cp',
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
			{include: `#Destructure-${ varname }`},
			(annot) ? annotation(lookaheads([',', '\\)'])) : {},
			// // if adding destructure defaults:
			// annotation(lookaheads([ASSN_START, ',', '\\)'])),
			// assignment(lookaheads([',', '\\)'])),
			{
				name: 'keyword.other.cp',
				match: '\\$|\\b(as)\\b',
			},
			unit(varname),
		],
	};
}
