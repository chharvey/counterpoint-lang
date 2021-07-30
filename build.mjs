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
		ClassBody:                     Pattern.CLASS_BODY,
		CommentBlock:                  Pattern.COMMENT_BLOCK,
		CommentLine:                   Pattern.COMMENT_LINE,
		ConstructorField:              Pattern.CONSTRUCTOR_FIELD,
		ConstructorParameters:         list('meta.parameters.cp', '\\(', '\\)', [{include: '#ConstructorField'}, {include: '#ParameterPatterns'}]),
		Declaration:                   Pattern.DECLARATION,
		DeclarationClass:              Pattern.DECLARATION__CLASS,
		DeclarationFunc:               Pattern.DECLARATION__FUNC,
		DeclarationInterface:          Pattern.DECLARATION__INTERFACE,
		DeclarationLet:                Pattern.DECLARATION__LET,
		DeclarationType:               Pattern.DECLARATION__TYPE,
		DeclarationTypefunc:           Pattern.DECLARATION__TYPEFUNC,
		DestructureArgument:           destructure('Argument',   {include: '#IdentifierParameter'}),
		DestructureAssignment:         destructure('Assignment', {include: '#Expression'}),
		DestructureParameter:          destructure('Parameter',  identifier(), true),
		DestructureProperty:           destructure('Property',   {include: '#IdentifierProperty'}),
		DestructureVariable:           destructure('Variable',   {include: '#IdentifierVariable'}, true),
		Expression:                    Pattern.EXPRESSION,
		ExpressionAccess:              Pattern.EXPRESSION__ACCESS,
		ExpressionCall:                Pattern.EXPRESSION__CALL,
		ExpressionClass:               Pattern.EXPRESSION__CLASS,
		ExpressionFunction:            Pattern.EXPRESSION__FUNCTION,
		ExpressionStructureGrouping:   Pattern.EXPRESSION__STRUCTURE__GROUPING,
		ExpressionStructureList:       Pattern.EXPRESSION__STRUCTURE__LIST,
		ExpressionStructureSet:        Pattern.EXPRESSION__STRUCTURE__SET,
		GenericArguments:              list('meta.genericarguments.cp', '<', '>', [{include: '#Type'}]),
		GenericParameterPatterns:      Pattern.GENERIC_PARAMETER_PATTERNS,
		GenericParameters:             list('meta.genericparameters.cp', '<', '>', [{include: '#GenericParameterPatterns'}]),
		Heritage:                      Pattern.HERITAGE,
		IdentifierClass:               identifier('entity.name.class'),
		IdentifierFunction:            identifier('entity.name.function'),
		IdentifierParameter:           identifier('variable.parameter'),
		IdentifierProperty:            identifier('entity.name.method'),
		IdentifierType:                identifier('entity.name.type'),
		IdentifierVariable:            identifier('entity.name.variable'),
		Keyword:                       Pattern.KEYWORD,
		MemberConstructor:             Pattern.MEMBER__CONSTRUCTOR,
		MemberField:                   Pattern.MEMBER__FIELD,
		MemberMethod:                  Pattern.MEMBER__METHOD,
		Number:                        Pattern.NUMBER,
		ParameterPatterns:             Pattern.PARAMETER_PATTERNS,
		Parameters:                    list('meta.parameters.cp', '\\(', '\\)', [{include: '#ParameterPatterns'}]),
		PossibleGenericParameter:      Pattern.POSSIBLE_GENERIC_PARAMETER,
		PossibleParameter:             Pattern.POSSIBLE_PARAMETER,
		PossibleTypeParameter:         Pattern.POSSIBLE_TYPE_PARAMETER,
		Statement:                     Pattern.STATEMENT,
		StatementAugmentation:         Pattern.STATEMENT__AUGMENTATION,
		StatementControl:              Pattern.STATEMENT__CONTROL,
		String:                        Pattern.STRING,
		Template:                      Pattern.TEMPLATE,
		Type:                          Pattern.TYPE,
		TypeCall:                      Pattern.TYPE_CALL,
		TypeFunction:                  Pattern.TYPE__FUNCTION,
		TypeInterface:                 Pattern.TYPE__INTERFACE,
		TypeParameterPatterns:         Pattern.TYPE_PARAMETER_PATTERNS,
		TypeParameters:                list('meta.parameters.cp', '\\(', '\\)', [{include: '#TypeParameterPatterns'}]),
		TypeStructureGrouping:         Pattern.TYPE__STRUCTURE__GROUPING,
		TypeStructureList:             Pattern.TYPE__STRUCTURE__LIST,
		TypeStructureSet:              Pattern.TYPE__STRUCTURE__SET,
	},
	patterns: [
		{include: '#Block'},
		{include: '#Declaration'},
		{include: '#Statement'},
	],
}));
