import {
	pattern_name,
	lookaheads,
} from '../helpers.js';
import {
	OWS,
	COMP_ACCESS,
	OPT,
	ASSN_START,
} from '../selectors.js';
import {
	constraint,
	annotation,
	assignment,
} from './_helpers.js';


export const DECLARATION__TYPE = {
	name: pattern_name('meta.declaration.type'),
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(type)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#DestructureTypeAlias'},
		{include: '#ModifiersDeclarationType'},
		constraint(lookaheads([ASSN_START])),
		assignment(ASSN_START, lookaheads([';']), '#Type'),
		{
			name:  pattern_name('storage.modifier'),
			match: COMP_ACCESS,
		},
		{
			name: pattern_name('storage.type'),
			match: '\\b(type)\\b',
		},
		{include: '#IdentifierType'}, // must come after keywords
	],
};


export const DECLARATION__VARIABLE = {
	name: pattern_name('meta.declaration.val'),
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(val)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#DestructureVariable'},
		{include: '#ModifiersDeclarationVariable'},
		annotation(lookaheads([ASSN_START, ';'])),
		assignment(ASSN_START, lookaheads([';'])),
		{
			name:  pattern_name('storage.modifier'),
			match: COMP_ACCESS,
		},
		{
			name: pattern_name('storage.type'),
			match: '\\b(val)\\b',
		},
		{
			name:  pattern_name('keyword.other.optional'),
			match: OPT,
		},
		{include: '#IdentifierVariable'}, // must come after keywords
	],
};


export const DECLARATION = {
	patterns: [
		{include: '#DeclarationType'},
		{include: '#DeclarationTypefunction'},
		{include: '#DeclarationVariable'},
		{include: '#DeclarationFunction'},
		{include: '#DeclarationClass'},
		{include: '#DeclarationInterface'},
	],
};
