import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	OWS,
	ASSN_START,
	ARROW,
	BLOCK_END,
	FIELD,
	FIELD_CONSTRUCTOR,
	CONSTRUCTOR,
	METHOD,
} from '../selectors.js';
import {
	identifier,
	annotation,
	assignment,
	implicitReturn,
} from './_helpers.js';



export const HERITAGE = {
	name: 'meta.heritage.cp',
	begin: '\\b(extends|implements|inherits)\\b',
	end:   lookaheads(['\\b(extends|implements|inherits)\\b', '\\{']),
	beginCaptures: {
		0: {name: 'storage.modifier.cp'},
	},
	patterns: [
		{include: '#TypeAccess'},
		identifier('entity.other.inherited-class'),
		{
			name: 'punctuation.separator.cp',
			match: ',',
		},
	],
};


export const TYPE__INTERFACE = {
	name: 'meta.type.interface.cp',
	begin: lookaheads(['\\b(interface)\\b']),
	end:   lookbehinds(['\\}']),
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
					match: '\\b(readonly)\\b',
				},
				{include: '#CommentBlock'},
				{include: '#CommentLine'},
				{include: '#GenericParameters'},
			],
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#Heritage'},
		{include: '#ClassBody'},
	],
};


export const EXPRESSION__CLASS = {
	name: 'meta.expression.class.cp',
	begin: lookaheads(['\\b(class)\\b']),
	end:   lookbehinds(['\\}']),
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
					match: '\\b(final|abstract|readonly)\\b',
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
		{include: '#ClassBody'},
	],
};


export const STATEMENT__DECLARATION__CLASS = {
	name: 'meta.declaration.class.cp',
	begin: lookaheads([`(\\b(public|private)\\b${ OWS })?\\b(class)\\b`]),
	end:   lookbehinds(['\\}']),
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
					match: '\\b(final|abstract|readonly|nominal)\\b',
				},
				{include: '#GenericParameters'},
				{include: '#Captures'},
				identifier('entity.name.class'),
			],
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#Heritage'},
		{include: '#ClassBody'},
	],
};


export const STATEMENT__DECLARATION__INTERFACE = {
	name: 'meta.declaration.interface.cp',
	begin: lookaheads([`(\\b(public|private)\\b${ OWS })?\\b(interface)\\b`]),
	end:   lookbehinds(['\\}']),
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
					match: '\\b(readonly|nominal)\\b',
				},
				{include: '#GenericParameters'},
				identifier('entity.name.class'),
			],
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#Heritage'},
		{include: '#ClassBody'},
	],
};


export const CONSTRUCTOR_FIELD = {
	name: 'meta.field.cp',
	begin: lookaheads([FIELD_CONSTRUCTOR]),
	end:   lookaheads([',', '\\)']),
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|secret|private|protected|override|final|readonly)\\b',
		},
		{include: '#IdentifierProperty'},
		annotation(lookaheads([ASSN_START, ',', '\\)'])),
		assignment(lookaheads([',', '\\)'])),
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
			match: '\\b(static|public|secret|private|protected|override|final|readonly)\\b',
		},
		{include: '#IdentifierProperty'},
		annotation(lookaheads([ASSN_START, ';'])),
		assignment(lookaheads([';'])),
	],
};


export const MEMBER__CONSTRUCTOR = {
	name: 'meta.constructor.cp',
	begin: lookaheads([CONSTRUCTOR]),
	end:   lookbehinds(['\\}']),
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|secret|private|protected|new)\\b',
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#ConstructorParameters'},
		{include: '#Block'},
	],
};


export const MEMBER__METHOD = {
	name: 'meta.method.cp',
	begin: lookaheads([METHOD]),
	end:   [lookbehinds(['\\}']), ';'].join('|'),
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(static|public|secret|private|protected|override|final|mutating)\\b',
		},
		{include: '#IdentifierProperty'},
		{include: '#GenericParameters'},
		{include: '#Parameters'},
		{include: '#Block'},
		annotation(lookaheads(['\\{', ARROW, ';'])),
		implicitReturn(),
	],
};


export const CLASS_BODY = {
	name: 'meta.classbody.cp',
	begin: '\\{',
	end:   BLOCK_END,
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#MemberField'},
		{include: '#MemberConstructor'},
		{include: '#MemberMethod'},
	],
};
