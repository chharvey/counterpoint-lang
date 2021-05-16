import {
	lookaheads,
} from '../helpers.js';
import {
	OWS,
	ASSN_START,
	DESTRUCTURE_ASSIGNEES,
} from '../selectors.js';
import {
	identifier,
	annotation,
	assignment,
} from './_helpers.js';



export const STATEMENT__CONTROL = {
	name: 'meta.control.cp',
	begin: '\\b(if|unless|while|until|do|for|break|continue|return|throw)\\b',
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
	end:   `\\}${ lookaheads(['\\}'], true) }`,
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#Member'},
		{include: '#Statement'},
	],
};
