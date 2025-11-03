import {
	pattern_name,
	digits,
} from '../helpers.js';
import {VARNAME} from '../selectors.js';



export const COMMENT_LINE = {
	name: pattern_name('comment.line.percentage'),
	match: '(%).*$',
	captures: {
		1: {name: pattern_name('punctuation.delimiter')},
	},
};


export const COMMENT_BLOCK = {
	name: pattern_name('comment.block'),
	begin: '%%',
	end:   '%%',
	captures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
};


export const SYMBOL = {
	patterns: [
		{
			name:     pattern_name('constant.other.quoted.single'),
			begin:    '@\'',
			end:      '\'',
			captures: {0: {name: pattern_name('punctuation.delimiter')}},
		},
		{
			name:  pattern_name('constant.other'),
			match: `@${ VARNAME }`,
		},
	],
};


export const NUMBER = {
	patterns: [
		{
			name: pattern_name('constant.numeric.radix'),
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
				1: {name: pattern_name('punctuation.operator')},
				2: {name: pattern_name('punctuation.delimiter.radix')},
				3: {name: pattern_name('punctuation.delimiter.radix')},
				4: {name: pattern_name('punctuation.delimiter.radix')},
				5: {name: pattern_name('punctuation.delimiter.radix')},
				6: {name: pattern_name('punctuation.delimiter.radix')},
				7: {name: pattern_name('punctuation.delimiter.radix')},
				8: {name: pattern_name('punctuation.delimiter.radix')},
			},
		},
		{
			name: pattern_name('constant.numeric.decimal'),
			match: `(\\+|-)?${ digits('[0-9]') }(?:(\\.)${ digits('[0-9]') }(?:(e)(\\+|-)?${ digits('[0-9]') })?(d)?)?`,
			captures: {
				1: {name: pattern_name('punctuation.operator')},
				2: {name: pattern_name('punctuation.separator.decimal')},
				3: {name: pattern_name('punctuation.separator.exponent')},
				4: {name: pattern_name('punctuation.operator')},
				5: {name: pattern_name('punctuation.delimiter.decimal')},
			},
		},
	],
};


export const STRING = {
	name: pattern_name('string.quoted.double'),
	begin: '"',
	end:   '"',
	captures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{
			name: pattern_name('constant.character.escape'),
			match: `(\\\\u\\{)(${ digits('[0-9a-f]') })?(\\})`,
			captures: {
				1: {name: pattern_name('punctuation.delimiter.escape')},
				2: {name: pattern_name('constant.numeric.hex')},
				3: {name: pattern_name('punctuation.delimiter.escape')},
			},
		},
		{
			name: pattern_name('invalid.illegal'),
			begin: '\\\\u\\{',
			end:   '\\}',
		},
		{
			name: pattern_name('constant.character.escape'),
			match: '(\\\\)(.|\\n)',
			captures: {
				1: {name: pattern_name('punctuation.delimiter')},
			},
		},
		{
			name: pattern_name('comment.block'),
			begin: '%%',
			end:   '(%%)|(?=")',
			beginCaptures: {
				0: {name: pattern_name('punctuation.delimiter')},
			},
			endCaptures: {
				1: {name: pattern_name('punctuation.delimiter')},
			},
		},
		{
			name: pattern_name('comment.line.percentage'),
			match: '(%)[^"]*(\\n|(?="))',
			captures: {
				1: {name: pattern_name('punctuation.delimiter')},
			},
		},
	],
};


export const TEMPLATE = {
	name: pattern_name('string.quoted.triple'),
	begin: '"""|}}',
	end:   '"""|{{',
	captures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
};
