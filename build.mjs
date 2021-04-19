import * as fs from 'fs';
import * as path from 'path';


function digits(charclass, base = '') {
	return `${ (base) ? `\\\\${ base }` : '' }${ charclass }(_?${ charclass })*`;
}

function unit(varname = 'variable.other') {
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
				match: `(\\+|-)?${ dec }(\\.(${ dec }(e(\\+|-)?${ dec })?)?)?`,
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
				name: 'keyword.control',
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
				name: 'invalid.illegal',
				match: '__|_(?=\\b)',
			},
		],
	};
}
function annotation(end, optional_allowed = false) {
	return {
		name: 'meta.annotation.cp',
		begin: ((optional_allowed) ? '\\??' : '').concat(Punctuator.ANNO_START),
		end,
		beginCaptures: {
			0: {name: 'punctuation.delimiter.cp'},
		},
		patterns: [
			{include: '#Type'},
		],
	};
}
function assignment(end, kind = '#Expression') {
	return {
		name: 'meta.assignment.cp',
		begin: Punctuator.ASSN_START,
		end,
		beginCaptures: {
			0: {name: 'punctuation.delimiter.cp'},
		},
		patterns: [
			{include: kind},
		],
	};
}
function destructure(varname) {
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
			annotation(lookaheads([',', '\\)'])),
			// // if adding destructure defaults:
			// annotation(lookaheads([Punctuator.ASSN_START, ',', '\\)'])),
			// assignment(lookaheads([',', '\\)'])),
			{
				name: 'keyword.other',
				match: '\\$|\\b(as)\\b',
			},
			unit(varname),
		],
	};
}

function lookaheads(aheads = [], negative = false) {
	return `(?${ (negative) ? '!' : '=' }${ aheads.join('|') })`;
}
function lookbehinds(behinds = [], negative = false) {
	return `(?<${ (negative) ? '!' : '=' }${ behinds.join('|') })`;
}

const dec = digits('[0-9]'); // `[0-9](_?[0-9])*`

const Punctuator = {
	ANNO_START: ':',
	ASSN_START: `=${ lookaheads(['=', '>'], true) }`,
	TYPEARROW:  '->',
};

const Selector = {
	OWS: `(?:\\s+|(%%(?:%?[^%])*%%))*`,
	VAR: '(?:\\b[A-Za-z_][A-Za-z0-9_]*\\b|`.*`)',
};


await fs.promises.writeFile(path.join(path.dirname(new URL(import.meta.url).pathname), 'syntaxes', 'cp.tmLanguage.json'), JSON.stringify({
	$schema: 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
	name: 'Counterpoint',
	scopeName: 'source.cp',
	repository: {
		CommentBlock: {
			name: 'comment.block.cp',
			begin: '%%',
			end:   '%%',
			captures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
		},
		TypeParameters: {
			name: 'meta.typeparameters.cp',
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
				{
					name: 'meta.annotation.cp',
					begin: '\\b(narrows|widens)\\b',
					end: lookaheads([Punctuator.ASSN_START, ',', '>']),
					beginCaptures: {
						0: {name: 'keyword.modifier.cp'},
					},
					patterns: [
						{include: '#Type'},
					],
				},
				assignment(lookaheads([',', '>']), '#Type'),
				unit('variable.parameter'),
			],
		},
		TypeArguments: {
			name: 'meta.typearguments.cp',
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
		},
		PromiseType: {
			name: 'meta.type.structure.promise.cp',
			begin: '\\{',
			end:   `\\}${ lookaheads(['\\}'], true) }`,
			captures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
			patterns: [
				{include: '#Type'},
			],
		},
		Type: {
			patterns: [
				{
					name: 'keyword.operator.punctuation.cp',
					match: `!|\\?|&|\\|`,
				},
				{
					name: 'meta.type.lambda.cp',
					begin: lookaheads([
						'<',
						[`(\\(.*\\)|${ lookbehinds(['\\)']) })`, Selector.OWS, Punctuator.TYPEARROW].join(''),
					]),
					end: lookbehinds(['\\}']),
					patterns: [
						{
							name: 'keyword.operator.punctuation.cp',
							match: Punctuator.TYPEARROW,
						},
						{
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
								annotation(lookaheads([',', '\\)']), true),
								unit('variable.parameter'),
							],
						},
						{include: '#CommentBlock'},
						{include: '#PromiseType'},
						{include: '#TypeParameters'},
					],
				},
				{
					name: 'meta.type.access.cp',
					begin: ['(\\.)', lookaheads([[Selector.OWS, '<'].join('')])].join(''),
					end:   lookbehinds(['>']),
					beginCaptures: {
						1: {name: 'keyword.operator.punctuation.cp'},
					},
					patterns: [
						{include: '#CommentBlock'},
						{include: '#TypeArguments'},
					],
				},
				{
					name: 'meta.type.structure.grouping.cp',
					begin: '\\(',
					end:   '\\)',
					captures: {
						0: {name: 'punctuation.delimiter.cp'},
					},
					patterns: [
						/** Parameters of function types, if on separate lines. */
						{
							begin: lookaheads([[Selector.VAR, Selector.OWS, '\\??', Punctuator.ANNO_START].join('')]),
							end:   `,|${ lookaheads(['\\)']) }`,
							endCaptures: {
								0: {name: 'punctuation.separator.cp'},
							},
							patterns: [
								annotation(lookaheads([',', '\\)']), true),
								unit('variable.parameter'),
							],
						},
						{include: '#Type'},
					],
				},
				{
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
						annotation(lookaheads([',', '\\]'])),
						{include: '#Type'},
					],
				},
				{include: '#PromiseType'},
				unit(),
			],
		},
		Expression: {
			patterns: [
				{
					name: 'storage.type.cp',
					match: '=>',
				},
				{
					name: 'keyword.operator.punctuation.cp',
					match: '<=|>=|!<|!>|==|!=|&&|!&|\\|\\||!\\||!|\\?|\\^|\\*|\\/|<|>|\\.|~',
				},
				{
					name: 'meta.expr.structure.grouping.cp',
					begin: '\\(',
					end:   '\\)',
					captures: {
						0: {name: 'punctuation.delimiter.cp'},
					},
					patterns: [
						{
							/*
							 * only in:
							 * - lambda parameters
							 * - function call arguments
							 */
							name: 'punctuation.separator.cp',
							match: ',',
						},
						/*
						 * only in:
						 * - lambda parameters
						 * - record property destructuring
						 * - function argument destructuring
						 * - reassignment destructuring
						 */
						annotation(lookaheads([Punctuator.ASSN_START, ',', '\\)', '\\{', '=>'])),
						/*
						 * only in:
						 * - parameters of lambdas
						 */
						assignment(lookaheads([',', '\\)'])),
						{
							/*
							 * only in:
							 * - named lambda parameters that are destructured
							 * - record property destructuring
							 * - function argument destructuring
							 * - reassignment destructuring
							 */
							name: 'keyword.other',
							match: '\\$|\\b(as)\\b',
						},
						{
							/*
							 * only in:
							 * - spreading arguments of function calls
							 */
							name: 'keyword.other',
							match: '##|#',
						},
						{include: '#Expression'},
					],
				},
				{
					name: 'meta.expr.structure.list.cp',
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
						/*
						 * only in:
						 * - record properties
						 */
						assignment(lookaheads(['\\|->', ',', '\\]'])),
						{
							/*
							 * only in:
							 * - record property punning
							 */
							name: 'keyword.other',
							match: '\\$',
						},
						{
							/*
							 * only in:
							 * - spreading values/properties in tuple/record literals
							 */
							name: 'keyword.other',
							match: '##|#',
						},
						{include: '#Expression'},
					],
				},
				{include: '#Block'},
				/*
				 * only in:
				 * - lambda return types
				 */
				annotation(lookaheads(['\\{', '=>'])),
				unit(),
				{
					/*
					 * Must come after units so that numbers can be lexed correctly.
					 */
					name: 'keyword.operator.punctuation.cp',
					match: '\\+|-',
				},
			],
		},
		[`Destructure-${ 'entity.name.variable' }`]: destructure('entity.name.variable'),
		[`Destructure-${ 'variable.parameter' }`]:   destructure('variable.parameter'),
		Statement: {
			patterns: [
				{
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
				},
				{
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
						{include: '#TypeParameters'},
						assignment(lookaheads([';']), '#Type'),
						unit('entity.name.type'),
					],
				},
				{
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
						{include: `#Destructure-${ 'entity.name.variable' }`},
						annotation(lookaheads([Punctuator.ASSN_START])),
						assignment(lookaheads([';'])),
						unit('entity.name.variable'),
					],
				},
				{
					name: 'meta.declaration.func.cp',
					begin: '\\b(func)\\b',
					end:   '(?=\\{)|=>',
					captures: {
						0: {name: 'storage.type.cp'},
					},
					patterns: [
						{include: '#TypeParameters'},
						{
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
								{include: `#Destructure-${ 'variable.parameter' }`},
								annotation(lookaheads([Punctuator.ASSN_START, ',', '\\)'])),
								assignment(lookaheads([',', '\\)'])),
								{
									name: 'keyword.other',
									match: '\\b(as)\\b',
								},
								unit('variable.parameter'),
							],
						},
						annotation(lookaheads(['\\{', '=>'])),
						unit('entity.name.function'),
					],
				},
				assignment(lookaheads([';'])),
				{
					name: 'punctuation.delimiter.cp',
					match: ';',
				},
				{include: '#Expression'},
			],
		},
		Block: {
			name: 'meta.block.cp',
			begin: '\\{',
			end:   `\\}${ lookaheads(['\\}'], true) }`,
			captures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
			patterns: [
				{include: '#Statement'},
			],
		},
	},
	patterns: [
		{include: '#Block'},
		{include: '#Statement'},
	],
}));
