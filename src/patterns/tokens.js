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


export const KEYWORD = {
	patterns: [
		{
			name: 'constant.language.cp',
			match: '\\b(null|false|true)\\b',
		},
		{
			name: 'support.type.cp',
			match: '\\b(never|void|bool|int|float|str|obj|unknown|this)\\b',
		},
		{
			name: 'variable.language.cp',
			match: '\\b(this|super|static|hyper)\\b',
		},
		{
			name: 'keyword.operator.text.cp',
			match: '\\b(mutable|is|isnt|if|then|else)\\b',
		},
		{
			name: 'storage.type.cp',
			match: '\\b(type|let|func|class|interface)\\b',
		},
		{
			name: 'support.class.cp',
			match: '\\b(Object|Class)\\b',
		},
		{
			name: 'storage.modifier.cp',
			match: `
				\\b(
					  public | secret | private | protected              # access modifiers
					| final | abstract | immutable | nominal             # class modifiers
					| static | new | override | mutating                 # member modifiers
					| unfixed                                            # variable modifiers
					| extends | implements | inherits | narrows | widens # class/interface/type heritage
				)\\b
			`.replace(/\#.*\n|\s+/g, ''),
		},
		{
			name: 'keyword.control.cp',
			match: '\\b(if|unless|then|else|while|until|do|for|from|to|by|in|break|continue|return|throw)\\b',
		},
		{
			name: 'keyword.other.alias.cp',
			match: '\\b(as)\\b',
		},
	],
};


export const NUMBER = {
	patterns: [
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
	],
};


export const STRING = {
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
};


export const TEMPLATE = {
	name: 'string.quoted.triple.cp',
	begin: '\'\'\'|}}',
	end:   '\'\'\'|{{',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
};
