import {
	digits,
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	OWS,
	INT,
	VAR,
	ANNO_START,
	ASSN_START,
	TYPEARROW,
	ARROW,
	DESTRUCTURE_PROPERTIES_OR_ARGUMENTS,
	FUNCTION,
	CLASS,
	INTERFACE,
	FIELD,
	METHOD,
} from '../selectors.js';
import {
	identifier,
	annotation,
	assignment,
} from '../patterns.js';



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

export const CAPTURES = {
	name: 'meta.captures.cp',
	begin: '\\[',
	end:   '\\]',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'punctuation.separator.cp',
			match: ',',
		},
		identifier(),
	],
};

export const GENERIC_PARAMETER_PATTERNS = {
	patterns: [
		{
			name: 'meta.heritage.cp',
			begin: '\\b(narrows|widens)\\b',
			end: lookaheads([ASSN_START, ',', '>']),
			beginCaptures: {
				0: {name: 'keyword.modifier.cp'},
			},
			patterns: [
				{include: '#Type'},
			],
		},
		assignment(lookaheads([',', '>']), '#Type'),
		{include: '#IdentifierParameter'},
	],
};

export const GENERIC_PARAMETERS = {
	name: 'meta.genericparameters.cp',
	begin: '<',
	end:   '>',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'punctuation.separator.cp',
			match: ',',
		},
		{include: '#GenericParameterPatterns'},
	],
};

/** Generic parameter, if on separate line. */
export const POSSIBLE_GENERIC_PARAMETER = {
	begin: lookaheads([[VAR, OWS, `(${ [
		'\\b(narrows|widens)\\b', ASSN_START, ',', // annotated, or more than 1 generic parameter
	].join('|') })`].join('')]),
	end: `,|${ lookaheads(['>']) }`,
	endCaptures: {
		0: {name: 'punctuation.separator.cp'},
	},
	patterns: [
		{include: '#GenericParameterPatterns'},
	],
};

export const TYPE_PARAMETER_PATTERNS = {
	patterns: [
		annotation(lookaheads([',', '\\)']), true),
		{include: '#IdentifierParameter'},
	],
};

export const TYPE_PARAMETERS = {
	name: 'meta.parameters.cp',
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
		{include: '#TypeParameterPatterns'},
	],
};

/** Parameter of function type, if on separate line. */
export const POSSIBLE_TYPE_PARAMETER = {
	begin: lookaheads([[VAR, OWS, '\\??', ANNO_START].join('')]),
	end:   `,|${ lookaheads(['\\)']) }`,
	endCaptures: {
		0: {name: 'punctuation.separator.cp'},
	},
	patterns: [
		{include: '#TypeParameterPatterns'},
	],
};

export const PARAMETER_PATTERNS = {
	patterns: [
		{
			name: 'keyword.other.alias.cp',
			match: '\\b(as)\\b',
		},
		{include: '#DestructureParameter'},
		annotation(lookaheads([ASSN_START, ',', '\\)'])),
		assignment(lookaheads([',', '\\)'])),
		{include: '#IdentifierParameter'},
	],
};

export const PARAMETERS = {
	name: 'meta.parameters.cp',
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
		{include: '#ParameterPatterns'},
	],
};

/** Parameter of function expression, if on separate line. */
export const POSSIBLE_PARAMETER = {
	begin: lookaheads([[VAR, OWS, `(${ [
		ANNO_START, ASSN_START, ',', '\\b(as)\\b', // annotated, or assigned, or more than 1 parameter, or destructured
	].join('|') })`].join('')]),
	end: `,|${ lookaheads(['\\)']) }`,
	endCaptures: {
		0: {name: 'punctuation.separator.cp'},
	},
	patterns: [
		{include: '#ParameterPatterns'},
	],
};

export const GENERIC_ARGUMENTS = {
	name: 'meta.genericarguments.cp',
	begin: '<',
	end:   '>',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'punctuation.separator.cp',
			match: ',',
		},
		{include: '#Type'},
	],
};

export const ARGUMENTS = {
	name: 'meta.arguments.cp',
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
			begin: lookaheads([[VAR, OWS, '\\$'].join('')]),
			end:   lookaheads([',', '\\)']),
			patterns: [
				{
					name: 'keyword.other.alias.cp',
					match: '\\$',
				},
				{include: '#IdentifierArgument'},
			],
		},
		{
			begin: lookaheads([
				[`(${ VAR }|${ DESTRUCTURE_PROPERTIES_OR_ARGUMENTS })`, OWS, ASSN_START].join(''),
			]),
			end: lookaheads([',', '\\)']),
			patterns: [
				{include: '#DestructureArgument'},
				assignment(lookaheads([',', '\\)'])),
				{include: '#IdentifierArgument'},
			],
		},
		{
			name: 'keyword.other.spread.cp',
			match: '##|#',
		},
		{include: '#Expression'},
	],
};

export const PROMISE_TYPE = {
	name: 'meta.type.structure.promise.cp',
	begin: '\\{',
	end:   `\\}${ lookaheads(['\\}'], true) }`,
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#Type'},
	],
};

export const TYPE_ACCESS = {
	name: 'meta.type.access.cp',
	begin: ['(\\.)', lookaheads([[OWS, '<'].join('')])].join(''),
	end:   lookbehinds(['>']),
	beginCaptures: {
		1: {name: 'keyword.operator.punctuation.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#GenericArguments'},
	],
};

export const HERITAGE = {
	name: 'meta.heritage.cp',
	begin: '\\b(extends|implements|inherits)\\b',
	end:   lookaheads(['\\{']),
	beginCaptures: {
		0: {name: 'storage.modifier.cp'},
	},
	patterns: [
		{
			name: 'punctuation.separator.cp',
			match: ',',
		},
		{include: '#IdentifierType'},
		{include: '#TypeAccess'},
	],
};

export const TYPE__FUNCTION = {
	name: 'meta.type.func.cp',
	begin: lookaheads([
		'<',
		`\\(${ OWS }\\)`,
		`\\(${ OWS }${ VAR }${ OWS }\\??${ ANNO_START }`,
		`${ lookbehinds(['\\)']) }${ OWS }${ TYPEARROW }`,
	]),
	end: lookbehinds(['\\}']),
	patterns: [
		{
			name: 'keyword.operator.punctuation.cp',
			match: TYPEARROW,
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#TypeParameters'},
		{include: '#PromiseType'},
	],
};

export const TYPE__INTERFACE = {
	name: 'meta.type.interface.cp',
	begin: lookaheads([INTERFACE]),
	end:   lookaheads(['\\{']),
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(immutable)\\b',
		},
		{
			begin: '\\b(interface)\\b',
			end:   lookaheads(['\\b(extends|inherits)\\b', '\\{']),
			beginCaptures: {
				0: {name: 'storage.type.cp'},
			},
			patterns: [
				{include: '#CommentBlock'},
				{include: '#GenericParameters'},
			],
		},
		{include: '#Heritage'},
		{include: '#CommentBlock'},
	],
};

export const TYPE__STRUCTURE__GROUPING = {
	name: 'meta.type.structure.grouping.cp',
	begin: '\\(',
	end:   '\\)',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#PossibleTypeParameter'},
		{include: '#Type'},
	],
};

export const TYPE__STRUCTURE__LIST = {
	name: 'meta.type.structure.list.cp',
	begin: '\\[',
	end:   '\\]',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'punctuation.separator.cp',
			match: ',',
		},
		{
			begin: lookaheads([
				[VAR, OWS, ANNO_START].join(''),
			]),
			end: lookaheads([',', '\\]']),
			patterns: [
				annotation(lookaheads([',', '\\]'])),
				{include: '#IdentifierProperty'},
			],
		},
		{
			name: 'keyword.other.spread.cp',
			match: '##|#',
		},
		{include: '#Type'},
	],
};

export const EXPRESSION__FUNCTION = {
	name: 'meta.expression.func.cp',
	begin: lookaheads([FUNCTION]),
	end: [lookaheads(['\\{']), ARROW].join('|'),
	endCaptures: {
		0: {name: 'storage.type.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#Captures'},
		{include: '#GenericParameters'},
		{include: '#Parameters'},
		annotation(lookaheads(['\\{', ARROW])),
	],
};

export const EXPRESSION__CLASS = {
	name: 'meta.expression.class.cp',
	begin: lookaheads([CLASS]),
	end:   lookaheads(['\\{']),
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(final|abstract|immutable)\\b',
		},
		{
			begin: '\\b(class)\\b',
			end:   lookaheads(['\\b(extends|implements)\\b', '\\{']),
			beginCaptures: {
				0: {name: 'storage.type.cp'},
			},
			patterns: [
				{include: '#CommentBlock'},
				{include: '#GenericParameters'},
			],
		},
		{include: '#Heritage'},
		{include: '#CommentBlock'},
	],
};

export const EXPRESSION__CALL = {
	name: 'meta.expression.call.cp',
	begin: ['(\\.)', lookaheads([[OWS, '(<|\\()'].join('')])].join(''),
	end:   lookbehinds(['\\)']),
	beginCaptures: {
		1: {name: 'keyword.operator.punctuation.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#GenericArguments'},
		{include: '#Arguments'},
	],
};

export const EXPRESSION__ACCESS = {
	patterns: [
		{
			name: 'meta.expression.access.cp',
			begin: ['(\\.)', lookaheads([[OWS, '\\['].join('')])].join(''),
			end:   lookbehinds(['\\]']),
			beginCaptures: {
				1: {name: 'keyword.operator.punctuation.cp'},
			},
			patterns: [
				{include: '#Expression'},
			],
		},
		{
			name: 'meta.expression.access.cp',
			begin: ['(\\.)', lookaheads([`${ OWS }(${ INT }|${ VAR })`])].join(''),
			end:   lookbehinds(['[A-Za-z0-9_]', '`']),
			beginCaptures: {
				1: {name: 'keyword.operator.punctuation.cp'},
			},
			patterns: [
				{include: '#Number'},
				identifier('variable.other', true),
			],
		},
	],
};

export const EXPRESSION__STRUCTURE__GROUPING = {
	name: 'meta.expression.structure.grouping.cp',
	begin: '\\(',
	end:   '\\)',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#PossibleParameter'},
		{include: '#Expression'},
	],
};

export const EXPRESSION__STRUCTURE__LIST = {
	name: 'meta.expression.structure.list.cp',
	begin: '\\[',
	end:   '\\]',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'punctuation.separator.cp',
			match: '\\|->|,',
		},
		{
			begin: lookaheads([[VAR, OWS, '\\$'].join('')]),
			end:   lookaheads([',', '\\]']),
			patterns: [
				{
					name: 'keyword.other.alias.cp',
					match: '\\$',
				},
				{include: '#IdentifierArgument'},
			],
		},
		{
			begin: lookaheads([
				[`(${ VAR }|${ DESTRUCTURE_PROPERTIES_OR_ARGUMENTS })`, OWS, ASSN_START].join(''),
			]),
			end: lookaheads([',', '\\]']),
			patterns: [
				{include: '#DestructureProperty'},
				assignment(lookaheads([',', '\\]'])),
				{include: '#IdentifierProperty'},
			],
		},
		{
			name: 'keyword.other.spread.cp',
			match: '##|#',
		},
		{include: '#Expression'},
	],
};

export const STATEMENT__CONTROL = {
	name: 'meta.control.cp',
	begin: '\\b(if|unless|while|until|do|for)\\b',
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
			match: '\\b(then|else|while|until|do|from|to|by|in)\\b',
		},
		{include: '#Expression'},
	],
};

export const STATEMENT__DECLARATION__TYPE = {
	name: 'meta.declaration.type.cp',
	begin: '\\b(type)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: 'storage.type.cp'},
	},
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#GenericParameters'},
		assignment(lookaheads([';']), '#Type'),
		identifier('entity.name.type'),
	],
};

export const STATEMENT__DECLARATION__LET = {
	name: 'meta.declaration.let.cp',
	begin: '\\b(let)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: 'storage.type.cp'},
	},
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#DestructureVariable'},
		annotation(lookaheads([ASSN_START])),
		assignment(lookaheads([';'])),
		identifier('entity.name.variable'),
	],
};

export const STATEMENT__DECLARATION__FUNC = {
	name: 'meta.declaration.func.cp',
	begin: '\\b(func)\\b',
	end:   [lookaheads(['\\{']), ARROW].join('|'),
	captures: {
		0: {name: 'storage.type.cp'},
	},
	patterns: [
		{include: '#Captures'},
		{include: '#GenericParameters'},
		{include: '#Parameters'},
		annotation(lookaheads(['\\{', ARROW])),
		identifier('entity.name.function'),
	],
};

export const STATEMENT__DECLARATION__CLASS = {
	name: 'meta.declaration.class.cp',
	begin: lookaheads([`(\\b(public|private)\\b${ OWS })?${ CLASS }`]),
	end:   lookaheads(['\\{']),
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|private|final|abstract|immutable)\\b',
		},
		{
			begin: '\\b(class)\\b',
			end:   lookaheads(['\\b(extends|implements)\\b', '\\{']),
			beginCaptures: {
				0: {name: 'storage.type.cp'},
			},
			patterns: [
				{
					name: 'storage.modifier.cp',
					match: '\\b(nominal)\\b',
				},
				{include: '#GenericParameters'},
				identifier('entity.name.class'),
			],
		},
		{include: '#Heritage'},
		{include: '#CommentBlock'},
	],
};

export const STATEMENT__DECLARATION__INTERFACE = {
	name: 'meta.declaration.interface.cp',
	begin: lookaheads([`(\\b(public|private)\\b${ OWS })?${ INTERFACE }`]),
	end:   lookaheads(['\\{']),
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|private|immutable)\\b',
		},
		{
			begin: '\\b(interface)\\b',
			end:   lookaheads(['\\b(extends|inherits)\\b', '\\{']),
			beginCaptures: {
				0: {name: 'storage.type.cp'},
			},
			patterns: [
				{
					name: 'storage.modifier.cp',
					match: '\\b(nominal)\\b',
				},
				{include: '#GenericParameters'},
				identifier('entity.name.class'),
			],
		},
		{include: '#Heritage'},
		{include: '#CommentBlock'},
	],
};

export const STATEMENT__AUGMENTATION = {
	name: 'meta.augmentation.cp',
	begin: '&&=|!&=|\\|\\|=|!\\|=|\\^=|\\*=|\\/=|\\+=|-=|\\+\\+|--|\\*\\*|\\/\\/',
	end: lookaheads([';']),
	beginCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#Expression'},
	],
};

export const MEMBER__FIELD = {
	name: 'meta.field.cp',
	begin: lookaheads([FIELD]),
	end:   ';',
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(static|public|secret|private|protected|final|override)\\b',
		},
		annotation(lookaheads([ASSN_START, ';'])),
		assignment(lookaheads([';'])),
		identifier('entity.name.field'),
	],
};

export const MEMBER__METHOD = {
	name: 'meta.method.cp',
	begin: lookaheads([METHOD]),
	end:   `${ lookaheads(['\\{']) }|(${ ARROW })|(;)`,
	endCaptures: {
		1: {name: 'storage.type.cp'},
		2: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(static|public|secret|private|protected|final|override|mutating)\\b',
		},
		{include: '#GenericParameters'},
		{include: '#Parameters'},
		annotation(lookaheads(['\\{', ARROW, ';'])),
		identifier('entity.name.method'),
	],
};

export const BLOCK = {
	name: 'meta.block.cp',
	begin: '\\{',
	end:   `\\}${ lookaheads(['\\}'], true) }`,
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#Member'},
		{include: '#Statement'},
	],
};
