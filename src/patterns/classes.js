import {
	lookaheads,
} from '../helpers.js';
import {
	OWS,
	ASSN_START,
	ARROW,
	FIELD,
	METHOD,
} from '../selectors.js';
import {
	identifier,
	annotation,
	assignment,
} from './_helpers.js';



export const HERITAGE = {
	name: 'meta.heritage.cp',
	begin: '\\b(extends|implements|inherits)\\b',
	end:   lookaheads(['\\{']),
	beginCaptures: {
		0: {name: 'storage.modifier.cp'},
	},
	patterns: [
		{
			name: 'punctuation.separator.cp',
			match: ',',
		},
		{include: '#IdentifierType'},
		{include: '#TypeAccess'},
	],
};


export const TYPE__INTERFACE = {
	name: 'meta.type.interface.cp',
	begin: lookaheads(['\\b(interface)\\b']),
	end:   lookaheads(['\\{']),
	patterns: [
		{
			begin: '\\b(interface)\\b',
			end:   lookaheads(['\\b(extends|inherits)\\b', '\\{']),
			beginCaptures: {
				0: {name: 'storage.type.cp'},
			},
			patterns: [
				{
					name: 'storage.modifier.cp',
					match: '\\b(immutable)\\b',
				},
				{include: '#CommentBlock'},
				{include: '#CommentLine'},
				{include: '#GenericParameters'},
			],
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#Heritage'},
	],
};


export const EXPRESSION__CLASS = {
	name: 'meta.expression.class.cp',
	begin: lookaheads(['\\b(class)\\b']),
	end:   lookaheads(['\\{']),
	patterns: [
		{
			begin: '\\b(class)\\b',
			end:   lookaheads(['\\b(extends|implements)\\b', '\\{']),
			beginCaptures: {
				0: {name: 'storage.type.cp'},
			},
			patterns: [
				{
					name: 'storage.modifier.cp',
					match: '\\b(final|abstract|immutable)\\b',
				},
				{include: '#CommentBlock'},
				{include: '#CommentLine'},
				{include: '#GenericParameters'},
				{include: '#Captures'},
			],
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#Heritage'},
	],
};


export const STATEMENT__DECLARATION__CLASS = {
	name: 'meta.declaration.class.cp',
	begin: lookaheads([`(\\b(public|private)\\b${ OWS })?\\b(class)\\b`]),
	end:   lookaheads(['\\{']),
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|private)\\b',
		},
		{
			begin: '\\b(class)\\b',
			end:   lookaheads(['\\b(extends|implements)\\b', '\\{']),
			beginCaptures: {
				0: {name: 'storage.type.cp'},
			},
			patterns: [
				{
					name: 'storage.modifier.cp',
					match: '\\b(final|abstract|immutable|nominal)\\b',
				},
				{include: '#GenericParameters'},
				{include: '#Captures'},
				identifier('entity.name.class'),
			],
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#Heritage'},
	],
};


export const STATEMENT__DECLARATION__INTERFACE = {
	name: 'meta.declaration.interface.cp',
	begin: lookaheads([`(\\b(public|private)\\b${ OWS })?\\b(interface)\\b`]),
	end:   lookaheads(['\\{']),
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|private)\\b',
		},
		{
			begin: '\\b(interface)\\b',
			end:   lookaheads(['\\b(extends|inherits)\\b', '\\{']),
			beginCaptures: {
				0: {name: 'storage.type.cp'},
			},
			patterns: [
				{
					name: 'storage.modifier.cp',
					match: '\\b(immutable|nominal)\\b',
				},
				{include: '#GenericParameters'},
				identifier('entity.name.class'),
			],
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#Heritage'},
	],
};


export const MEMBER__FIELD = {
	name: 'meta.field.cp',
	begin: lookaheads([FIELD]),
	end:   ';',
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(static|public|secret|private|protected|final|override)\\b',
		},
		annotation(lookaheads([ASSN_START, ';'])),
		assignment(lookaheads([';'])),
		identifier('entity.name.field'),
	],
};

export const MEMBER__METHOD = {
	name: 'meta.method.cp',
	begin: lookaheads([METHOD]),
	end:   `${ lookaheads(['\\{']) }|(${ ARROW })|(;)`,
	endCaptures: {
		1: {name: 'storage.type.cp'},
		2: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(static|public|secret|private|protected|final|override|mutating)\\b',
		},
		{include: '#GenericParameters'},
		{include: '#Parameters'},
		annotation(lookaheads(['\\{', ARROW, ';'])),
		identifier('entity.name.method'),
	],
};


export const MEMBER = {
	patterns: [
		{include: '#MemberField'},
		{include: '#MemberMethod'},
	],
};
