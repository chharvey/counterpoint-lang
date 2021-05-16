import * as fs from 'fs';
import * as path from 'path';

import {
	identifier,
	list,
	destructure,
} from './src/patterns/index.js';
import * as Pattern from './src/patterns/index.js';



await fs.promises.writeFile(path.join(path.dirname(new URL(import.meta.url).pathname), 'syntaxes', 'cp.tmLanguage.json'), JSON.stringify({
	$schema: 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
	name: 'Counterpoint',
	scopeName: 'source.cp',
	repository: {
		Arguments:                     Pattern.ARGUMENTS,
		Block:                         Pattern.BLOCK,
		Captures:                      list('meta.captures.cp', '\\[', '\\]', [identifier()]),
		CommentBlock:                  Pattern.COMMENT_BLOCK,
		CommentLine:                   Pattern.COMMENT_LINE,
		ConstructorField:              Pattern.CONSTRUCTOR_FIELD,
		ConstructorParameters:         list('meta.parameters.cp', '\\(', '\\)', [{include: '#ConstructorField'}, {include: '#ParameterPatterns'}]),
		DestructureArgument:           destructure('Argument',   {include: '#IdentifierArgument'}),
		DestructureAssignment:         destructure('Assignment', {include: '#Expression'}),
		DestructureParameter:          destructure('Parameter',  {include: '#IdentifierParameter'}, true),
		DestructureProperty:           destructure('Property',   {include: '#IdentifierProperty'}),
		DestructureVariable:           destructure('Variable',   {include: '#IdentifierVariable'},  true),
		GenericArguments:              list('meta.genericarguments.cp', '<', '>', [{include: '#Type'}]),
		GenericParameterPatterns:      Pattern.GENERIC_PARAMETER_PATTERNS,
		GenericParameters:             list('meta.genericparameters.cp', '<', '>', [{include: '#GenericParameterPatterns'}]),
		Heritage:                      Pattern.HERITAGE,
		IdentifierArgument:            identifier('variable.name'),
		IdentifierField:               identifier('entity.name.field', true),
		IdentifierParameter:           identifier('variable.parameter'),
		IdentifierProperty:            identifier('variable.name', true),
		IdentifierType:                identifier('entity.name.type'),
		IdentifierVariable:            identifier('entity.name.variable'),
		Keyword:                       Pattern.KEYWORD,
		Member:                        Pattern.MEMBER,
		MemberConstructor:             Pattern.MEMBER__CONSTRUCTOR,
		MemberField:                   Pattern.MEMBER__FIELD,
		MemberMethod:                  Pattern.MEMBER__METHOD,
		Number:                        Pattern.NUMBER,
		ParameterPatterns:             Pattern.PARAMETER_PATTERNS,
		Parameters:                    list('meta.parameters.cp', '\\(', '\\)', [{include: '#ParameterPatterns'}]),
		PossibleGenericParameter:      Pattern.POSSIBLE_GENERIC_PARAMETER,
		PossibleParameter:             Pattern.POSSIBLE_PARAMETER,
		PossibleTypeParameter:         Pattern.POSSIBLE_TYPE_PARAMETER,
		PromiseType:                   Pattern.PROMISE_TYPE,
		String:                        Pattern.STRING,
		Template:                      Pattern.TEMPLATE,
		Type:                          Pattern.TYPE,
		TypeAccess:                    Pattern.TYPE_ACCESS,
		TypeFunction:                  Pattern.TYPE__FUNCTION,
		TypeInterface:                 Pattern.TYPE__INTERFACE,
		TypeParameterPatterns:         Pattern.TYPE_PARAMETER_PATTERNS,
		TypeParameters:                list('meta.parameters.cp', '\\(', '\\)', [{include: '#TypeParameterPatterns'}]),
		TypeStructureGrouping:         Pattern.TYPE__STRUCTURE__GROUPING,
		TypeStructureList:             Pattern.TYPE__STRUCTURE__LIST,
		Expression:                    Pattern.EXPRESSION,
		ExpressionAccess:              Pattern.EXPRESSION__ACCESS,
		ExpressionCall:                Pattern.EXPRESSION__CALL,
		ExpressionClass:               Pattern.EXPRESSION__CLASS,
		ExpressionFunction:            Pattern.EXPRESSION__FUNCTION,
		ExpressionStructureGrouping:   Pattern.EXPRESSION__STRUCTURE__GROUPING,
		ExpressionStructureList:       Pattern.EXPRESSION__STRUCTURE__LIST,
		Statement:                     Pattern.STATEMENT,
		StatementAugmentation:         Pattern.STATEMENT__AUGMENTATION,
		StatementControl:              Pattern.STATEMENT__CONTROL,
		StatementDeclarationClass:     Pattern.STATEMENT__DECLARATION__CLASS,
		StatementDeclarationFunc:      Pattern.STATEMENT__DECLARATION__FUNC,
		StatementDeclarationInterface: Pattern.STATEMENT__DECLARATION__INTERFACE,
		StatementDeclarationLet:       Pattern.STATEMENT__DECLARATION__LET,
		StatementDeclarationType:      Pattern.STATEMENT__DECLARATION__TYPE,
	},
	patterns: [
		{include: '#Block'},
		{include: '#Member'},
		{include: '#Statement'},
	],
}));
