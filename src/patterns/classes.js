import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
	COMP_ACCESS,
	MEMB_ACCESS,
	UNFIXED,
	NOMINAL,
	MUTABLE,
	PERMISSION,
	IMPL,
	ASSN_START,
	DFLT_START,
	FATARROW,
	BLOCK_END,
	FIELD,
	FIELD_CONSTRUCTOR,
	CONSTRUCTOR,
	CONSTRUCTORGROUP,
	METHOD,
	METHODGROUP,
} from '../selectors.js';
import {
	identifier,
	annotation,
	assignment,
	implicitReturn,
} from './_helpers.js';



export const HERITAGE = {
	name:  'meta.heritage.cp',
	begin: `\\b(extends|${ IMPL }|inherits)\\b`,
	end:   lookaheads([`\\b(extends|${ IMPL }|inherits)\\b`, DELIMS.CAPTURES[0], DELIMS.BLOCK[0]]),
	beginCaptures: {
		0: {name: 'storage.modifier.cp'},
	},
	patterns: [
		{include: '#TypeCall'},
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
	end:   lookbehinds([BLOCK_END]),
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
			match: '\\b(data)\\b',
		},
	],
};


export const EXPRESSION__CLASS = {
	name: 'meta.expression.class.cp',
	begin: '\\b(class)\\b',
	end:   lookbehinds([BLOCK_END]),
	beginCaptures: {
		0: {name: 'storage.type.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#Heritage'},
		{include: '#Captures'},
		{include: '#ClassBody'},
		{
			name: 'storage.modifier.cp',
			match: '\\b(final|abstract|enum|data)\\b',
		},
	],
};


export const DECLARATION__CLASS = {
	name: 'meta.declaration.class.cp',
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(class)\\b`]),
	end:   lookbehinds([BLOCK_END]),
	patterns: [
		{include: '#GenericParameters'},
		{include: '#Heritage'},
		{include: '#Captures'},
		{include: '#ClassBody'},
		{
			name: 'storage.type.cp',
			match: '\\b(class)\\b',
		},
		{
			name:  'storage.modifier.cp',
			match: `\\b(${ COMP_ACCESS }final|abstract|enum|data|${ NOMINAL })\\b`,
		},
		{include: '#IdentifierClass'}, // must come after keywords
	],
};


export const DECLARATION__INTERFACE = {
	name: 'meta.declaration.interface.cp',
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(interface)\\b`]),
	end:   lookbehinds([BLOCK_END]),
	patterns: [
		{include: '#GenericParameters'},
		{include: '#Heritage'},
		{include: '#ClassBody'},
		{
			name: 'storage.type.cp',
			match: '\\b(interface)\\b',
		},
		{
			name:  'storage.modifier.cp',
			match: `\\b(${ COMP_ACCESS }|data|${ NOMINAL })\\b`,
		},
		{include: '#IdentifierClass'}, // must come after keywords
	],
};


export const STATIC__BLOCK = {
	name: 'meta.staticblock.cp',
	begin: [`(\\b(?:static)\\b)${ OWS }`, lookaheads([DELIMS.BLOCK[0]])].join(''),
	end:   lookbehinds([BLOCK_END]),
	beginCaptures: {
		1: {name: 'storage.modifier.cp'},
	},
	patterns: [
		{include: '#ClassBody'},
	],
};


export const CONSTRUCTOR_FIELD = {
	name: 'meta.field.cp',
	begin: lookaheads([FIELD_CONSTRUCTOR]),
	end:   lookaheads([',', DELIMS.PARAMS_FN[1]]),
	patterns: [
		{
			name:  'storage.modifier.cp',
			match: `\\b(${ MEMB_ACCESS }|${ IMPL }|${ PERMISSION }|${ UNFIXED })\\b`,
		},
		{
			name:  'punctuation.delimiter.cp',
			match: ASSN_START,
		},
		{include: '#IdentifierProperty'},
		{include: '#DestructureParameter'},
		annotation(lookaheads([DFLT_START, ',', DELIMS.PARAMS_FN[1]])),
		assignment(DFLT_START, lookaheads([',', DELIMS.PARAMS_FN[1]])),
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
			name:  'storage.modifier.cp',
			match: `\\b(${ MEMB_ACCESS }|${ IMPL }|claim|${ PERMISSION })\\b`,
		},
		{include: '#IdentifierProperty'},
		annotation(lookaheads([ASSN_START, ';'])),
		assignment(ASSN_START, lookaheads([';'])),
	],
};


export const MEMBER__CONSTRUCTOR = {
	name: 'meta.constructor.cp',
	begin: lookaheads([CONSTRUCTOR]),
	end:   lookbehinds([BLOCK_END]),
	patterns: [
		{
			name:  'storage.modifier.cp',
			match: `\\b(${ MEMB_ACCESS }|new)\\b`,
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#ConstructorParameters'},
		{include: '#Block'},
	],
};


export const MEMBER__CONSTRUCTORGROUP = {
	name: 'meta.constructorgroup.cp',
	begin: lookaheads([CONSTRUCTORGROUP]),
	end:   lookbehinds([BLOCK_END]),
	patterns: [
		{
			name:  'storage.modifier.cp',
			match: `\\b(${ MEMB_ACCESS }|new)\\b`,
		},
		{
			name: 'meta.constructorgroupbody.cp',
			begin: DELIMS.BLOCK[0],
			end:   DELIMS.BLOCK[1],
			captures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
			patterns: [
				{include: '#CommentBlock'},
				{include: '#CommentLine'},
				{include: '#MemberConstructor'},
			],
		},
	],
};


export const MEMBER__METHOD = {
	name: 'meta.method.cp',
	begin: lookaheads([METHOD]),
	end:   [lookbehinds([BLOCK_END]), ';'].join('|'),
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name:  'storage.modifier.cp',
			match: `\\b(${ MEMB_ACCESS }|override|${ IMPL }|claim|final${ MUTABLE }|async|gen)\\b`,
		},
		{include: '#IdentifierProperty'},
		{include: '#GenericParameters'},
		{include: '#Parameters'},
		{include: '#Block'},
		annotation(lookaheads([DELIMS.BLOCK[0], FATARROW, ';']), false),
		implicitReturn(),
	],
};


export const MEMBER__METHODGROUP = {
	name: 'meta.methodgroup.cp',
	begin: lookaheads([METHODGROUP]),
	end:   lookbehinds([BLOCK_END]),
	patterns: [
		{
			name:  'storage.modifier.cp',
			match: `\\b(${ MEMB_ACCESS }|override|${ IMPL }|claim|final|${ MUTABLE })\\b`,
		},
		{include: '#IdentifierProperty'},
		{
			name: 'meta.methodgroupbody.cp',
			begin: DELIMS.BLOCK[0],
			end:   DELIMS.BLOCK[1],
			captures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
			patterns: [
				{include: '#CommentBlock'},
				{include: '#CommentLine'},
				{include: '#MemberMethod'},
			],
		},
	],
};


export const CLASS_BODY = {
	name: 'meta.classbody.cp',
	begin: DELIMS.BLOCK[0],
	end:   DELIMS.BLOCK[1],
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#StaticBlock'},
		{include: '#MemberField'},
		{include: '#MemberConstructor'},
		{include: '#MemberConstructorgroup'},
		{include: '#MemberMethod'},
		{include: '#MemberMethodgroup'},
	],
};
