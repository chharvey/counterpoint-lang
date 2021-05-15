import * as fs from 'fs';
import * as path from 'path';

import {
	lookaheads,
} from './src/helpers.js';
import {
	OWS,
	ASSN_START,
	DESTRUCTURE_ASSIGNEES,
} from './src/selectors.js';
import {
	identifier,
	unit,
	assignment,
	destructure,
} from './src/patterns.js';
import * as Pattern from './src/patterns/index.js';



await fs.promises.writeFile(path.join(path.dirname(new URL(import.meta.url).pathname), 'syntaxes', 'cp.tmLanguage.json'), JSON.stringify({
	$schema: 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
	name: 'Counterpoint',
	scopeName: 'source.cp',
	repository: {
		CommentLine:              Pattern.COMMENT_LINE,
		CommentBlock:             Pattern.COMMENT_BLOCK,
		Keyword:                  Pattern.KEYWORD,
		IdentifierType:      identifier('entity.name.type'),
		IdentifierVariable:  identifier('entity.name.variable'),
		IdentifierProperty:  identifier('variable.name', true),
		IdentifierParameter: identifier('variable.parameter'),
		IdentifierArgument:  identifier('variable.name'),
		Number:                   Pattern.NUMBER,
		String:                   Pattern.STRING,
		Template:                 Pattern.TEMPLATE,
		Captures:                 Pattern.CAPTURES,
		GenericParameterPatterns: Pattern.GENERIC_PARAMETER_PATTERNS,
		GenericParameters:        Pattern.GENERIC_PARAMETERS,
		PossibleGenericParameter: Pattern.POSSIBLE_GENERIC_PARAMETER,
		TypeParameterPatterns:    Pattern.TYPE_PARAMETER_PATTERNS,
		TypeParameters:           Pattern.TYPE_PARAMETERS,
		PossibleTypeParameter:    Pattern.POSSIBLE_TYPE_PARAMETER,
		ParameterPatterns:        Pattern.PARAMETER_PATTERNS,
		Parameters:               Pattern.PARAMETERS,
		PossibleParameter:        Pattern.POSSIBLE_PARAMETER,
		GenericArguments:         Pattern.GENERIC_ARGUMENTS,
		Arguments:                Pattern.ARGUMENTS,
		PromiseType:              Pattern.PROMISE_TYPE,
		TypeAccess:               Pattern.TYPE_ACCESS,
		DestructureVariable:   destructure('Variable',   {include: '#IdentifierVariable'},  true),
		DestructureProperty:   destructure('Property',   {include: '#IdentifierProperty'}),
		DestructureParameter:  destructure('Parameter',  {include: '#IdentifierParameter'}, true),
		DestructureArgument:   destructure('Argument',   {include: '#IdentifierArgument'}),
		DestructureAssignment: destructure('Assignment', {include: '#Expression'}),
		Heritage: Pattern.HERITAGE,
		Type: {
			patterns: [
				{
					name: 'keyword.operator.punctuation.cp',
					match: `!|\\?|&|\\|`,
				},
				Pattern.TYPE__FUNCTION,
				Pattern.TYPE__INTERFACE,
				{include: '#TypeAccess'},
				Pattern.TYPE__STRUCTURE__GROUPING,
				Pattern.TYPE__STRUCTURE__LIST,
				{
					name: 'support.type.cp',
					match: '\\b(this)\\b',
				},
				{include: '#PromiseType'},
				unit('entity.name.type'),
			],
		},
		Expression: {
			patterns: [
				Pattern.EXPRESSION__FUNCTION,
				Pattern.EXPRESSION__CLASS,
				Pattern.EXPRESSION__CALL,
				Pattern.EXPRESSION__ACCESS,
				Pattern.EXPRESSION__STRUCTURE__GROUPING,
				Pattern.EXPRESSION__STRUCTURE__LIST,
				{
					name: 'variable.language.cp',
					match: '\\b(this)\\b',
				},
				{include: '#Block'},
				unit(),
				{
					name: 'keyword.operator.punctuation.cp',
					match: '<=|>=|!<|!>|==|!=|&&|!&|\\|\\||!\\||!|\\?|\\+|-|\\^|\\*|\\/|<|>|~',
				},
			],
		},
		Statement: {
			patterns: [
				Pattern.STATEMENT__CONTROL,
				Pattern.STATEMENT__DECLARATION__TYPE,
				Pattern.STATEMENT__DECLARATION__LET,
				Pattern.STATEMENT__DECLARATION__FUNC,
				Pattern.STATEMENT__DECLARATION__CLASS,
				Pattern.STATEMENT__DECLARATION__INTERFACE,
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
				Pattern.STATEMENT__AUGMENTATION,
				assignment(lookaheads([';'])),
				{include: '#Expression'},
			],
		},
		Member: {
			patterns: [
				Pattern.MEMBER__FIELD,
				Pattern.MEMBER__METHOD,
			],
		},
		Block: Pattern.BLOCK,
	},
	patterns: [
		{include: '#Block'},
		{include: '#Member'},
		{include: '#Statement'},
	],
}));
