import {
	lookaheads,
} from '../helpers.js';
import {
	ASSN_START,
} from '../selectors.js';
import {
	annotation,
	assignment,
} from './_helpers.js';


export const DECLARATION__TYPE = {
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
		{include: '#IdentifierType'},
		{include: '#GenericParameters'},
		assignment(lookaheads([';']), '#Type'),
	],
};


export const DECLARATION__LET = {
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
		{include: '#IdentifierVariable'},
		{include: '#DestructureVariable'},
		annotation(lookaheads([ASSN_START])),
		assignment(lookaheads([';'])),
	],
};


export const DECLARATION = {
	patterns: [
		{include: '#DeclarationType'},
		{include: '#DeclarationLet'},
		{include: '#DeclarationFunc'},
		{include: '#DeclarationClass'},
		{include: '#DeclarationInterface'},
	],
};
