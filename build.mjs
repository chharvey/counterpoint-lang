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
	DESTRUCTURE_PROPERTIES_OR_ARGUMENTS,
	DESTRUCTURE_ASSIGNEES,
} from './src/selectors.js';
import {
	identifier,
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
					name: 'keyword.other.alias.cp',
					match: '\\b(as)\\b',
				},
			],
		},
		IdentifierVariable:  identifier('entity.name.variable'),
		IdentifierProperty:  identifier('variable.name', true),
		IdentifierParameter: identifier('variable.parameter'),
		IdentifierArgument:  identifier('variable.name'),
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
				{include: '#IdentifierParameter'},
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
				{include: '#IdentifierParameter'},
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
					name: 'keyword.other.alias.cp',
					match: '\\b(as)\\b',
				},
				{include: '#DestructureParameter'},
				annotation(lookaheads([ASSN_START, ',', '\\)'])),
				assignment(lookaheads([',', '\\)'])),
				{include: '#IdentifierParameter'},
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
		DestructureVariable:   destructure('Variable',   {include: '#IdentifierVariable'},  true),
		DestructureProperty:   destructure('Property',   {include: '#IdentifierProperty'}),
		DestructureParameter:  destructure('Parameter',  {include: '#IdentifierParameter'}, true),
		DestructureArgument:   destructure('Argument',   {include: '#IdentifierArgument'}),
		DestructureAssignment: destructure('Assignment', {include: '#Expression'}),
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
				},
				{include: '#PromiseType'},
				unit('entity.name.type'),
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
						{include: '#CommentBlock'},
						{include: '#CommentLine'},
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
						{include: '#GenericArguments'},
						{include: '#Arguments'},
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
						{include: '#Number'},
						identifier('variable.other', true),
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
						{
							begin: lookaheads([[VAR, OWS, '\\$'].join('')]),
							end:   lookaheads([',', '\\]']),
							patterns: [
								{
									name: 'keyword.other.alias.cp',
									match: '\\$',
								},
								{include: '#IdentifierProperty'},
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
						identifier('entity.name.type'),
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
						{include: '#DestructureVariable'},
						annotation(lookaheads([ASSN_START])),
						assignment(lookaheads([';'])),
						identifier('entity.name.variable'),
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
						identifier('entity.name.function'),
					],
				},
				{
					begin: lookaheads([
						[DESTRUCTURE_ASSIGNEES, OWS, ASSN_START].join(''),
					]),
					end: lookaheads([ASSN_START]),
					patterns: [
						{include: '#CommentBlock'},
						{include: '#DestructureAssignment'},
					],
				},
				{
					name: 'punctuation.delimiter.cp',
					match: ';',
				},
				assignment(lookaheads([';'])),
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
