import * as fs from 'fs';
import * as path from 'path';

import {
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
					begin: ['(\\.)', lookaheads([[OWS, '<'].join('')])].join(''),
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
							begin: lookaheads([[VAR, OWS, '\\??', ANNO_START].join('')]),
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
					name: 'keyword.operator.punctuation.cp',
					match: '<=|>=|!<|!>|==|!=|&&|!&|\\|\\||!\\||!|\\?|\\^|\\*|\\/|~',
				},
				{
					name: 'meta.expr.func.cp',
					begin: lookaheads([
						`<${ OWS }${ VAR }${ OWS }(${ [
							'\\b(narrows|widens)\\b', ASSN_START, ',', // annotated, or assigned, or more than 1 type parameter
							`>${ OWS }(?<aftertypeparams>\\(${ OWS }${ VAR }${ OWS }(${ [ // exactly 1 unannotated uninitialized type parameter
								ANNO_START, ASSN_START, ',', '\\b(as)\\b', // annotated, or assigned, or more than 1 parameter, or destrucured
								`\\)${ OWS }(?<afterparams>${ [ANNO_START, ARROW, '\\{'].join('|') })`, // exactly 1 unannotated uninitialized nondestructued parameter
							].join('|') }))`,
						].join('|') })`,
						`\\(${ OWS }\\)${ OWS }\\k<afterparams>`,
						`\\g<aftertypeparams>`,
						`${ lookbehinds(['\\)']) }${ OWS }\\k<afterparams>`,
					]),
					end: [lookaheads(['\\{']), ARROW].join('|'),
					endCaptures: {
						0: {name: 'storage.type.cp'},
					},
					patterns: [
						{include: '#TypeParameters'},
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
						{
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
						{include: '#TypeArguments'},
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
						/** Parameters of function expressions, if on separate lines. */
						{
							begin: lookaheads([[VAR, OWS, `(${ [
								ANNO_START, ASSN_START, ',', '\\b(as)\\b', // annotated, or assigned, or more than 1 parameter, or destrucured
							].join('|') })`].join('')]),
							end: `,|${ lookaheads(['\\)']) }`,
							endCaptures: {
								0: {name: 'punctuation.separator.cp'},
							},
							patterns: [
								{include: '#ParameterPatterns'},
							],
						},
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
					 * Must come after meta.expr.func.cp so that type parameters can be parsed correctly.
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
						{include: '#TypeParameters'},
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
