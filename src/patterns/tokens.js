import {
	digits,
} from '../helpers.js';
import {VARNAME} from '../selectors.js';



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


export const SYMBOL = {
	patterns: [
		{
			name:     'constant.other.quoted.single.cp',
			begin:    '@\'',
			end:      '\'',
			captures: {0: {name: 'punctuation.delimiter.cp'}},
		},
		{
			name:  'constant.other.cp',
			match: `@${ VARNAME }`,
		},
	],
};


export const NUMBER = {
	patterns: [
		{
			name: 'constant.numeric.radix.cp',
			match: `(\\+|-)?(?:${ [
				digits('[0-1]',    'b'), // `(\\\\b)(?:[0-1]_?)*[0-1]`
				digits('[0-3]',    'q'),
				digits('[0-5]',    's'),
				digits('[0-7]',    'o'),
				digits('[0-9]',    'd'),
				digits('[0-9a-f]', 'x'),
				digits('[0-9a-z]', 'z'),
			].join('|') })`,
			captures: {
				1: {name: 'punctuation.operator.cp'},
				2: {name: 'punctuation.delimiter.radix.cp'},
				3: {name: 'punctuation.delimiter.radix.cp'},
				4: {name: 'punctuation.delimiter.radix.cp'},
				5: {name: 'punctuation.delimiter.radix.cp'},
				6: {name: 'punctuation.delimiter.radix.cp'},
				7: {name: 'punctuation.delimiter.radix.cp'},
				8: {name: 'punctuation.delimiter.radix.cp'},
			},
		},
		{
			name: 'constant.numeric.decimal.cp',
			match: `(\\+|-)?${ digits('[0-9]') }(?:(\\.)${ digits('[0-9]') }(?:(e)(\\+|-)?${ digits('[0-9]') })?)?`,
			captures: {
				1: {name: 'punctuation.operator.cp'},
				2: {name: 'punctuation.separator.decimal.cp'},
				3: {name: 'punctuation.separator.exponent.cp'},
				4: {name: 'punctuation.operator.cp'},
			},
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
			match: `(\\\\u\\{)(${ digits('[0-9a-f]') })?(\\})`,
			captures: {
				1: {name: 'punctuation.delimiter.escape.cp'},
				2: {name: 'constant.numeric.hex.cp'},
				3: {name: 'punctuation.delimiter.escape.cp'},
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
