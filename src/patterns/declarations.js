import {
	lookaheads,
} from '../helpers.js';
import {
	OWS,
	ASSN_START,
} from '../selectors.js';
import {
	unit,
	annotation,
	assignment,
	implicitReturn,
} from './_helpers.js';


export const DECLARATION__TYPE = {
	name: 'meta.declaration.type.cp',
	begin: lookaheads([`(\\b(public|private)\\b${ OWS })?\\b(type)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#GenericParameters'},
		assignment(lookaheads([';']), '#Type'),
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|private)\\b',
		},
		{
			name: 'storage.type.cp',
			match: '\\b(type)\\b',
		},
		{
			name: 'storage.modifier.cp',
			match: '\\b(nominal)\\b',
		},
		{include: '#IdentifierType'}, // must come after keywords
	],
};


export const DECLARATION__TYPEFUNC = {
	name: 'meta.declaration.typefunc.cp',
	begin: lookaheads([`(\\b(public|private)\\b${ OWS })?\\b(typefunc)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#GenericParameters'},
		implicitReturn('#Type'),
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|private)\\b',
		},
		{
			name: 'storage.type.cp',
			match: '\\b(typefunc)\\b',
		},
		{include: '#IdentifierType'}, // must come after keywords
	],
};


export const DECLARATION__LET = {
	name: 'meta.declaration.let.cp',
	begin: lookaheads([`(\\b(public|private)\\b${ OWS })?\\b(let)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#DestructureVariable'},
		annotation(lookaheads([ASSN_START])),
		assignment(lookaheads([';'])),
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|private)\\b',
		},
		{
			name: 'storage.type.cp',
			match: '\\b(let)\\b',
		},
		{
			name: 'storage.modifier.cp',
			match: '\\b(unfixed)\\b',
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
			name: 'keyword.operator.punctuation.cp',
			match: '~~|\\+\\+',
		},
		{include: '#DestructureAssignment'},
		{include: '#ExpressionClaim'},
		{include: '#ExpressionCall'},
		{include: '#ExpressionAccess'},
		unit(),
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
		{
			name: 'keyword.operator.punctuation.cp',
			match: '~~|\\+\\+',
		},
		{include: '#DestructureAssignment'},
		{include: '#ExpressionClaim'},
		{include: '#ExpressionCall'},
		{include: '#ExpressionAccess'},
		unit(),
		assignment(lookaheads([';'])),
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
