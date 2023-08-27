import {
	digits,
} from '../helpers.js';



export const COMMENT_LINE = {
	name: 'comment.line.percentage.cp',
	match: '(%).*$',
	captures: {
		1: {name: 'punctuation.delimiter.cp'},
	},
};


export const COMMENT_BLOCK = {
	name: 'comment.block.cp',
	begin: '%%',
	end:   '%%',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
};


export const NUMBER = {
	patterns: [
		{
			name: 'constant.numeric.radix.cp',
			match: `(\\+|-)?(${ [
				digits('[0-1]',    'b'), // `\\\\b([0-1]_?)*[0-1]`
				digits('[0-3]',    'q'),
				digits('[0-7]',    'o'),
				digits('[0-9]',    'd'),
				digits('[0-9a-f]', 'x'),
				digits('[0-9a-z]', 'z'),
			].join('|') })`,
		},
		{
			name: 'constant.numeric.decimal.cp',
			match: `(\\+|-)?${ digits('[0-9]') }(\\.${ digits('[0-9]') }(e(\\+|-)?${ digits('[0-9]') })?)?`,
		},
	],
};


export const STRING = {
	name: 'string.quoted.double.cp',
	begin: '"',
	end:   '"',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'constant.character.escape.cp',
			match: `(\\\\)u\\{(${ digits('[0-9a-f]') })?\\}`,
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
			end:   '(%%)|(?=")',
			beginCaptures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
			endCaptures: {
				1: {name: 'punctuation.delimiter.cp'},
			},
		},
		{
			name: 'comment.line.percentage.cp',
			match: '(%)[^"]*(\\n|(?="))',
			captures: {
				1: {name: 'punctuation.delimiter.cp'},
			},
		},
	],
};


export const TEMPLATE = {
	name: 'string.quoted.triple.cp',
	begin: '"""|}}',
	end:   '"""|{{',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
};
