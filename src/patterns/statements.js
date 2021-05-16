import {
	lookaheads,
} from '../helpers.js';
import {
	OWS,
	ASSN_START,
	BLOCK_END,
	DESTRUCTURE_ASSIGNEES,
} from '../selectors.js';
import {
	identifier,
	annotation,
	assignment,
	control,
} from './_helpers.js';



export const STATEMENT__CONTROL = {
	patterns: [
		control(['if', 'unless'], ['then', 'else', 'if', 'unless']),
		control(['while', 'until', 'do'], ['do', 'while', 'until']),
		control(['for'], ['from', 'to', 'by', 'in', 'do']),
		{
			name: 'meta.control.cp',
			begin: `\\b(continue)\\b`,
			end:   ';',
			beginCaptures: {
				0: {name: 'keyword.control.cp'},
			},
			endCaptures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
		},
		{
			name: 'meta.control.cp',
			begin: `\\b(break|return|throw)\\b`,
			end:   ';',
			beginCaptures: {
				0: {name: 'keyword.control.cp'},
			},
			endCaptures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
			patterns: [
				{include: '#Expression'},
			],
		},
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
		{
			name: 'storage.modifier.cp',
			match: '\\b(unfixed)\\b',
		},
		{include: '#DestructureVariable'},
		annotation(lookaheads([ASSN_START])),
		assignment(lookaheads([';'])),
		identifier('entity.name.variable'),
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


export const STATEMENT = {
	patterns: [
		{include: '#StatementControl'},
		{include: '#StatementDeclarationType'},
		{include: '#StatementDeclarationLet'},
		{include: '#StatementDeclarationFunc'},
		{include: '#StatementDeclarationClass'},
		{include: '#StatementDeclarationInterface'},
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
		{include: '#StatementAugmentation'},
	],
};


export const BLOCK = {
	name: 'meta.block.cp',
	begin: '\\{',
	end:   BLOCK_END,
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#Statement'},
	],
};
