import {
	lookaheads,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
	VAR,
	COMP_ACCESS,
	IMPL,
	ANNO_START,
	ASSN_START,
} from '../selectors.js';
import {
	unit,
	identifier,
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
		annotation(lookaheads([ASSN_START, ';'])),
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
		{
			name:  'meta.heritage.cp',
			begin: IMPL,
			end:   lookaheads([';']),
			beginCaptures: {
				0: {name: 'storage.modifier.cp'},
			},
			patterns: [
				{include: '#TypeCall'},
				identifier('entity.other.inherited-class'),
			],
		},
		{
			begin: lookaheads([[VAR, OWS, `(${ DELIMS.PARAMS_GN[0] }|${ DELIMS.PARAMS_FN[0] })`].join('')]),
			end:   lookaheads([ANNO_START, IMPL]),
			patterns: [
				{include: '#IdentifierFunction'},
				{include: '#GenericParameters'},
				{include: '#TypeParameters'},
			],
		},
		{include: '#ExpressionAssignee'},
		annotation(lookaheads([IMPL, ';'])),
	],
};


export const DECLARATION__SET = {
	name:  'meta.declaration.set.cp',
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
		assignment(`${ ASSN_START }|(&&|\\|\\||\\?\\?|![&|]|[\\^*/+-])=`, lookaheads([';'])),
	],
};


export const DECLARATION__DELETE = {
	name:  'meta.declaration.delete.cp',
	begin: '\\b(delete)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: 'storage.type.cp'},
	},
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		identifier(),
	],
};


export const DECLARATION = {
	patterns: [
		{include: '#DeclarationType'},
		{include: '#DeclarationTypefunc'},
		{include: '#DeclarationLet'},
		{include: '#DeclarationFunction'},
		{include: '#DeclarationClaim'},
		{include: '#DeclarationSet'},
		{include: '#DeclarationDelete'},
		{include: '#DeclarationClass'},
		{include: '#DeclarationInterface'},
	],
};
