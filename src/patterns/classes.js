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
	begin: '\\b(interface)\\b',
	end:   lookbehinds(['\\}']),
	beginCaptures: {
		0: {name: 'storage.type.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#Heritage'},
		{include: '#ClassBody'},
		{
			name: 'storage.modifier.cp',
			match: '\\b(readonly)\\b',
		},
	],
};


export const EXPRESSION__CLASS = {
	name: 'meta.expression.class.cp',
	begin: '\\b(class)\\b',
	end:   lookbehinds(['\\}']),
	beginCaptures: {
		0: {name: 'storage.type.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#Captures'},
		{include: '#GenericParameters'},
		{include: '#Heritage'},
		{include: '#ClassBody'},
		{
			name: 'storage.modifier.cp',
			match: '\\b(final|abstract|readonly)\\b',
		},
	],
};


export const DECLARATION__CLASS = {
	name: 'meta.declaration.class.cp',
	begin: lookaheads([`(\\b(public|private)\\b${ OWS })?\\b(class)\\b`]),
	end:   lookbehinds(['\\}']),
	patterns: [
		{include: '#Captures'},
		{include: '#GenericParameters'},
		{include: '#Heritage'},
		{include: '#ClassBody'},
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|private)\\b',
		},
		{
			name: 'storage.type.cp',
			match: '\\b(class)\\b',
		},
		{
			name: 'storage.modifier.cp',
			match: '\\b(final|abstract|readonly|nominal)\\b',
		},
		{include: '#IdentifierClass'}, // must come after keywords
	],
};


export const DECLARATION__INTERFACE = {
	name: 'meta.declaration.interface.cp',
	begin: lookaheads([`(\\b(public|private)\\b${ OWS })?\\b(interface)\\b`]),
	end:   lookbehinds(['\\}']),
	patterns: [
		{include: '#GenericParameters'},
		{include: '#Heritage'},
		{include: '#ClassBody'},
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|private)\\b',
		},
		{
			name: 'storage.type.cp',
			match: '\\b(interface)\\b',
		},
		{
			name: 'storage.modifier.cp',
			match: '\\b(readonly|nominal)\\b',
		},
		{include: '#IdentifierClass'}, // must come after keywords
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
