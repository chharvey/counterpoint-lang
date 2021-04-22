import * as fs from 'fs';
import * as path from 'path';

import {
	digits,
	lookaheads,
	lookbehinds,
} from './src/helpers.js';
import {
	OWS,
	INT,
	VAR,
	ANNO_START,
	ASSN_START,
	TYPEARROW,
	ARROW,
	DESTRUCTURE,
} from './src/selectors.js';
import {
	unit,
	annotation,
	assignment,
	destructure,
} from './src/patterns.js';



await fs.promises.writeFile(path.join(path.dirname(new URL(import.meta.url).pathname), 'syntaxes', 'cp.tmLanguage.json'), JSON.stringify({
	$schema: 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
	name: 'Counterpoint',
	scopeName: 'source.cp',
	repository: {
		CommentLine: {
			name: 'comment.line.percentage.cp',
			match: '(%).*$',
			captures: {
				1: {name: 'punctuation.delimiter.cp'},
			},
		},
		CommentBlock: {
			name: 'comment.block.cp',
			begin: '%%',
			end:   '%%',
			captures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
		},
		Keyword: {
			patterns: [
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
			],
		},
		Number: {
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
		},
		String: {
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
		Template: {
			name: 'string.quoted.triple.cp',
			begin: '\'\'\'|}}',
			end:   '\'\'\'|{{',
			captures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
		},
		GenericParameterPatterns: {
			patterns: [
				{
					name: 'meta.annotation.cp',
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
				unit('variable.parameter'),
			],
		},
		GenericParameters: {
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
		},
		/** Generic parameter, if on separate line. */
		PossibleGenericParameter: {
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
		},
		TypeParameterPatterns: {
			patterns: [
				annotation(lookaheads([',', '\\)']), true),
				unit('variable.parameter'),
			],
		},
		TypeParameters: {
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
		},
		/** Parameter of function type, if on separate line. */
		PossibleTypeParameter: {
			begin: lookaheads([[VAR, OWS, '\\??', ANNO_START].join('')]),
			end:   `,|${ lookaheads(['\\)']) }`,
			endCaptures: {
				0: {name: 'punctuation.separator.cp'},
			},
			patterns: [
				{include: '#TypeParameterPatterns'},
			],
		},
		ParameterPatterns: {
			patterns: [
				{
					name: 'keyword.other.cp',
					match: '\\b(as)\\b',
				},
				{include: `#Destructure-${ 'variable.parameter' }`},
				annotation(lookaheads([ASSN_START, ',', '\\)'])),
				assignment(lookaheads([',', '\\)'])),
				unit('variable.parameter'),
			],
		},
		Parameters: {
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
		},
		/** Parameter of function expression, if on separate line. */
		PossibleParameter: {
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
		},
		GenericArguments: {
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
		},
		Arguments: {
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
							name: 'keyword.other.cp',
							match: '\\$',
						},
						unit('variable.name'),
					],
				},
				{
					begin: lookaheads([
						[`(${ VAR }|${ DESTRUCTURE })`, OWS, ASSN_START].join(''),
					]),
					end: lookaheads([',', '\\)']),
					patterns: [
						{include: `#Destructure-${ 'variable.name' }`},
						assignment(lookaheads([',', '\\)'])),
						unit('variable.name'),
					],
				},
				{
					name: 'keyword.other.cp',
					match: '##|#',
				},
				{include: '#Expression'},
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
					name: 'meta.type.func.cp',
					begin: lookaheads([
						'<',
						`\\(${ OWS }\\)`,
						`\\(${ OWS }${ VAR }${ OWS }${ ANNO_START }`,
						`${ lookbehinds(['\\)']) }${ OWS }${ TYPEARROW }`,
					]),
					end: lookbehinds(['\\}']),
					patterns: [
						{
							name: 'keyword.operator.punctuation.cp',
							match: TYPEARROW,
						},
						{include: '#CommentBlock'},
						{include: '#GenericParameters'},
						{include: '#TypeParameters'},
						{include: '#PromiseType'},
					],
				},
				{
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
				},
				{
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
					name: 'keyword.operator.punctuation.cp',
					match: '<=|>=|!<|!>|==|!=|&&|!&|\\|\\||!\\||!|\\?|\\^|\\*|\\/|~',
				},
				{
					name: 'meta.expr.func.cp',
					begin: lookaheads([
						`<${ OWS }${ VAR }${ OWS }(${ [
							'\\b(narrows|widens)\\b', ASSN_START, ',', // annotated, or assigned, or more than 1 generic parameter
							`>${ OWS }(?<aftertypeparams>${ [ // exactly 1 unannotated uninitialized generic parameter
								`\\(${ OWS }${ VAR }${ OWS }(${ [
									ANNO_START, ASSN_START, ',', '\\b(as)\\b', // annotated, or assigned, or more than 1 parameter, or destrucured
									`\\)${ OWS }(?<afterparams>${ [ANNO_START, ARROW, '\\{'].join('|') })`, // exactly 1 unannotated uninitialized nondestructued parameter
								].join('|') })`,
								`\\(${ OWS }\\)${ OWS }\\g<afterparams>`, // exactly 0 parameters
							].join('|') })`,
						].join('|') })`,
						`\\g<aftertypeparams>`,
						`${ lookbehinds(['\\)']) }${ OWS }\\g<afterparams>`,
					]),
					end: [lookaheads(['\\{']), ARROW].join('|'),
					endCaptures: {
						0: {name: 'storage.type.cp'},
					},
					patterns: [
						{include: '#GenericParameters'},
						{include: '#Parameters'},
						annotation(lookaheads(['\\{', '=>'])),
					],
				},
				{
					name: 'meta.expr.call.cp',
					begin: ['(\\.)', lookaheads([[OWS, '(<|\\()'].join('')])].join(''),
					end:   lookbehinds(['\\)']),
					beginCaptures: {
						1: {name: 'keyword.operator.punctuation.cp'},
					},
					patterns: [
						{include: '#CommentBlock'},
						{include: '#Arguments'},
						{include: '#GenericArguments'},
					],
				},
				{
					name: 'meta.expr.access.cp',
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
					name: 'meta.expr.access.cp',
					begin: ['(\\.)', lookaheads([`${ OWS }(${ INT }|${ VAR })`])].join(''),
					end:   lookbehinds(['[A-Za-z0-9_]', '`']),
					beginCaptures: {
						1: {name: 'keyword.operator.punctuation.cp'},
					},
					patterns: [
						unit(),
					],
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
							 * - record property destructuring
							 * - reassignment destructuring
							 */
							name: 'punctuation.separator.cp',
							match: ',',
						},
						// /*
						//  * if adding destructuring defaults:
						//  * - record property destructuring
						//  * - reassignment destructuring
						//  */
						// assignment(lookaheads([',', '\\)'])),
						{
							/*
							 * only in:
							 * - record property destructuring
							 * - reassignment destructuring
							 */
							name: 'keyword.other',
							match: '\\$|\\b(as)\\b',
						},
						{include: '#PossibleParameter'},
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
				unit(),
				{
					/*
					 * Must come after units so that numbers can be lexed correctly.
					 * Must come after meta.expr.func.cp so that generic parameters can be parsed correctly.
					 */
					name: 'keyword.operator.punctuation.cp',
					match: '\\+|-|<|>',
				},
			],
		},
		[`Destructure-${ 'entity.name.variable' }`]: destructure('entity.name.variable', true),
		[`Destructure-${ 'variable.parameter' }`]:   destructure('variable.parameter',   true),
		[`Destructure-${ 'variable.name' }`]:        destructure('variable.name'),
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
						{include: '#GenericParameters'},
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
						annotation(lookaheads([ASSN_START])),
						assignment(lookaheads([';'])),
						unit('entity.name.variable'),
					],
				},
				{
					name: 'meta.declaration.func.cp',
					begin: '\\b(func)\\b',
					end:   [lookaheads(['\\{']), ARROW].join('|'),
					captures: {
						0: {name: 'storage.type.cp'},
					},
					patterns: [
						{include: '#GenericParameters'},
						{include: '#Parameters'},
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
