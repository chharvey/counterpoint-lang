import {
	digits,
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
			{
				name: 'comment.line.percentage.cp',
				match: '(%).*$',
				captures: {
					1: {name: 'punctuation.delimiter.cp'},
				},
			},
			{
				name: 'string.quoted.triple.cp',
				begin: '\'\'\'|}}',
				end:   '\'\'\'|{{',
				captures: {
					0: {name: 'punctuation.delimiter.cp'},
				},
			},
			{
				name: 'string.quoted.single.cp',
				begin: '\'',
				end:   '\'',
				captures: {
					0: {name: 'punctuation.delimiter.cp'},
				},
				patterns: [
					{
						name: 'constant.character.escape.cp',
						match: `(\\\\)u\\{(${ digits('[0-9a-f]') })\\}`,
						captures: {
							1: {name: 'punctuation.delimiter.cp'},
							2: {name: 'constant.numeric.hex.cp'},
						},
					},
					{
						name: 'invalid.illegal.cp',
						begin: '\\\\u\\{',
						end:   '\\}',
					},
					{
						name: 'constant.character.escape.cp',
						match: '(\\\\)(.|\\n)',
						captures: {
							1: {name: 'punctuation.delimiter.cp'},
						},
					},
					{
						name: 'comment.block.cp',
						begin: '%%',
						end:   '(%%)|(?=\')',
						beginCaptures: {
							0: {name: 'punctuation.delimiter.cp'},
						},
						endCaptures: {
							1: {name: 'punctuation.delimiter.cp'},
						},
					},
					{
						name: 'comment.line.percentage.cp',
						match: '(%)[^\']*(\\n|(?=\'))',
						captures: {
							1: {name: 'punctuation.delimiter.cp'},
						},
					},
				],
			},
			{
				name: `${ varname }.quoted.cp`,
				begin: '`',
				end:   '`',
				captures: {
					0: {name: 'punctuation.delimiter.cp'},
				},
			},
			{
				name: 'constant.numeric.radix.cp',
				match: `(\\+|-)?(${ [
					digits('[0-1]',    'b'), // `\\\\b[0-1](_?[0-1])*`
					digits('[0-3]',    'q'),
					digits('[0-7]',    'o'),
					digits('[0-9]',    'd'),
					digits('[0-9a-f]', 'x'),
					digits('[0-9a-z]', 'z'),
				].join('|') })`,
			},
			{
				name: 'constant.numeric.decimal.cp',
				match: `(\\+|-)?${ digits('[0-9]') }(\\.(${ digits('[0-9]') }(e(\\+|-)?${ digits('[0-9]') })?)?)?`,
			},
			{
				name: 'constant.language.cp',
				match: '\\b(null|false|true)\\b',
			},
			{
				name: 'support.type.cp',
				match: '\\b(never|void|bool|int|float|str|obj|unknown)\\b',
			},
			{
				name: 'keyword.operator.text.cp',
				match: '\\b(mutable|is|isnt|if|then|else)\\b',
			},
			{
				name: 'storage.type.cp',
				match: '\\b(type|let|func)\\b',
			},
			{
				name: 'storage.modifier.cp',
				match: '\\b(unfixed|narrows|widens)\\b',
			},
			{
				name: 'keyword.control.cp',
				match: '\\b(if|unless|then|else|while|until|do|for|from|to|by|in|break|continue|return|throw)\\b',
			},
			{
				name: 'keyword.other.cp',
				match: '\\b(as)\\b',
			},
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
