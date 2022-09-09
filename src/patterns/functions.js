import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	OWS,
	VAR,
	ANNO_START,
	ASSN_START,
	FATARROW,
} from '../selectors.js';
import {
	annotation,
	assignment,
	implicitReturn,
} from './_helpers.js';



export const TYPE__FUNCTION = {
	name: 'meta.type.func.cp',
	begin: '\\b(fn|async|gen)\\b',
	end:   FATARROW,
	beginCaptures: {
		0: {name: 'storage.modifier.cp'},
	},
	endCaptures: {
		0: {name: 'keyword.operator.punctuation.cp'},
	},
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(gen)\\b',
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#TypeParameters'},
	],
};


export const EXPRESSION__FUNCTION = {
	name: 'meta.expression.func.cp',
	begin: '\\b(fn|async|gen)\\b',
	end:   [lookbehinds(['\\}']), FATARROW].join('|'),
	beginCaptures: {
		0: {name: 'storage.modifier.cp'},
	},
	endCaptures: {
		0: {name: 'storage.type.cp'},
	},
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(gen)\\b',
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#Captures'},
		{include: '#Parameters'},
		{include: '#Block'},
		annotation(lookaheads(['\\{', FATARROW])),
	],
};


export const DECLARATION__TYPEFUNC = {
	name: 'meta.declaration.typefunc.cp',
	begin: lookaheads([`(\\b(public|secret|private)\\b${ OWS })?\\b(typefunc)\\b`]),
	end:   ';',
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#GenericParameters'},
		implicitReturn('#Type'),
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|secret|private)\\b',
		},
		{
			name: 'storage.type.cp',
			match: '\\b(typefunc)\\b',
		},
		{include: '#IdentifierType'}, // must come after keywords
	],
};


export const DECLARATION__FUNC = {
	name: 'meta.declaration.func.cp',
	begin: lookaheads([`(\\b(public|secret|private)\\b${ OWS })?\\b(func)\\b(${ OWS }\\b(async)\\b)?(${ OWS }\\b(gen)\\b)?`]),
	end:   [lookbehinds(['\\}']), ';'].join('|'),
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#GenericParameters'},
		{include: '#Captures'},
		{include: '#Parameters'},
		{include: '#Block'},
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|secret|private|async|gen)\\b',
		},
		{
			name: 'storage.type.cp',
			match: '\\b(func)\\b',
		},
		{
			name: 'meta.heritage.cp',
			begin: '\\b(implements)\\b',
			end:   lookaheads(['\\[', '\\(']),
			beginCaptures: {
				0: {name: 'storage.modifier.cp'},
			},
			patterns: [
				{include: '#TypeCall'},
				{include: '#IdentifierType'},
			],
		},
		annotation(lookaheads(['\\{', FATARROW])),
		implicitReturn(),
		{include: '#IdentifierFunction'}, // must come after keywords
	],
};


export const GENERIC_PARAMETER_PATTERNS = {
	patterns: [
		{
			name: 'meta.heritage.cp',
			begin: '\\b(narrows|widens)\\b',
			end: lookaheads([ASSN_START, ',', '>']),
			beginCaptures: {
				0: {name: 'keyword.modifier.cp'},
			},
			patterns: [
				{include: '#Type'},
			],
		},
		assignment(lookaheads([',', '>']), '#Type'),
		{include: '#IdentifierParameter'},
	],
};


export const TYPE_PARAMETER_PATTERNS = {
	patterns: [
		annotation(lookaheads([',', '\\)'])),
		{
			begin: lookaheads([`${ VAR }${ OWS }${ ANNO_START }`]),
			end:   lookaheads([ANNO_START]),
			patterns: [
				{include: '#IdentifierParameter'},
			],
		},
		{include: '#Type'}, // must come after `variable.parameter.cp` so that it isn’t confused with `entity.name.type.cp`
	],
};


export const PARAMETER_PATTERNS = {
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(unfixed)\\b',
		},
		{
			name: 'keyword.other.alias.cp',
			match: '\\b(as)\\b',
		},
		{include: '#IdentifierParameter'},
		{include: '#DestructureParameter'},
		annotation(lookaheads([ASSN_START, ',', '\\)'])),
		assignment(lookaheads([',', '\\)'])),
	],
};
