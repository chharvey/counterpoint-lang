import {
	pattern_name,
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
	name: pattern_name('meta.declaration.type'),
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(type)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#DestructureTypeAlias'},
		{include: '#GenericParameters'},
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


export const DECLARATION__LET = {
	name: pattern_name('meta.declaration.let'),
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(let)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#DestructureVariable'},
		{include: '#ModifiersDeclarationLet'},
		annotation(lookaheads([ASSN_START, ';'])),
		assignment(ASSN_START, lookaheads([';'])),
		{
			name:  pattern_name('storage.modifier'),
			match: COMP_ACCESS,
		},
		{
			name: pattern_name('storage.type'),
			match: '\\b(let)\\b',
		},
		{include: '#IdentifierVariable'}, // must come after keywords
	],
};


export const DECLARATION__CLAIM = {
	name:  pattern_name('meta.declaration.claim'),
	begin: '\\b(claim)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('storage.type')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{
			name:  pattern_name('meta.heritage'),
			begin: IMPL,
			end:   lookaheads([';']),
			beginCaptures: {
				0: {name: pattern_name('storage.modifier')},
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
	name:  pattern_name('meta.declaration.set'),
	begin: '\\b(set)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('storage.type')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#ExpressionAssignee'},
		assignment(`${ ASSN_START }|(&&|\\|\\||![&|]|[\\^*/+-])=`, lookaheads([';'])),
	],
};


export const DECLARATION__DELETE = {
	name:  pattern_name('meta.declaration.delete'),
	begin: '\\b(delete)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('storage.type')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#ExpressionAssignee'},
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
