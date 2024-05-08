import {
	lookaheads,
} from '../helpers.js';
import {
	OWS,
	COMP_ACCESS,
	ASSN_START,
} from '../selectors.js';
import {
	unit,
	constraint,
	annotation,
	assignment,
	implicitReturn,
} from './_helpers.js';


export const DECLARATION__TYPE = {
	name: 'meta.declaration.type.cp',
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(type)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#DestructureTypeAlias'},
		{include: '#GenericParameters'},
		{include: '#ModifiersDeclarationType'},
		constraint(lookaheads([ASSN_START])),
		assignment(ASSN_START, lookaheads([';']), '#Type'),
		{
			name:  'storage.modifier.cp',
			match: COMP_ACCESS,
		},
		{
			name: 'storage.type.cp',
			match: '\\b(type)\\b',
		},
		{include: '#IdentifierType'}, // must come after keywords
	],
};


export const DECLARATION__LET = {
	name: 'meta.declaration.let.cp',
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(let)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#DestructureVariable'},
		{include: '#ModifiersDeclarationLet'},
		annotation(lookaheads([ASSN_START])),
		assignment(ASSN_START, lookaheads([';'])),
		{
			name:  'storage.modifier.cp',
			match: COMP_ACCESS,
		},
		{
			name: 'storage.type.cp',
			match: '\\b(let)\\b',
		},
		{include: '#IdentifierVariable'}, // must come after keywords
	],
};


export const DECLARATION__CLAIM = {
	name:  'meta.declaration.claim.cp',
	begin: '\\b(claim)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: 'storage.type.cp'},
	},
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#ExpressionAssignee'},
		annotation(lookaheads([';'])),
	],
};


export const DECLARATION__ASSIGNMENT = {
	name:  'meta.declaration.assignment.cp',
	begin: '\\b(set)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: 'storage.type.cp'},
	},
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#ExpressionAssignee'},
		assignment(ASSN_START, lookaheads([';'])),
		{
			name:  'meta.augmentation.cp',
			begin: '&&=|!&=|\\|\\|=|!\\|=|\\^=|\\*=|\\/=|\\+=|-=',
			end:   lookaheads([';']),
			beginCaptures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
			patterns: [
				{include: '#Expression'},
			],
		},
	],
};


export const DECLARATION = {
	patterns: [
		{include: '#DeclarationType'},
		{include: '#DeclarationTypefunc'},
		{include: '#DeclarationLet'},
		{include: '#DeclarationFunc'},
		{include: '#DeclarationClaim'},
		{include: '#DeclarationAssignment'},
		{include: '#DeclarationClass'},
		{include: '#DeclarationInterface'},
	],
};
