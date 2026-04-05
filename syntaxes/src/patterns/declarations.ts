import {
	pattern_name,
	lookaheads,
	R,
} from '../helpers.ts';
import {
	OWS,
	COMP_ACCESS,
	OPT,
	ASSN_START,
} from '../selectors.ts';
import {
	constraint,
	annotation,
	assignment,
} from './_helpers.ts';


export const DECLARATION__TYPE = {
	name: pattern_name('meta.declaration.type'),
	begin: lookaheads([R.s(R.o(R.s(COMP_ACCESS, OWS)), R.w('type'))]),
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
			match: R.w('type'),
		},
		{include: '#IdentifierType'}, // must come after keywords
	],
};


export const DECLARATION__VARIABLE = {
	name: pattern_name('meta.declaration.val'),
	begin: lookaheads([R.s(R.o(R.s(COMP_ACCESS, OWS)), R.w('val'))]),
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
			match: R.w('val'),
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
