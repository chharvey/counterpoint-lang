import {
	pattern_name,
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
	OVR,
	OVR_CLAIM,
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
	name:  pattern_name('meta.heritage'),
	begin: `\\b(extends|${ IMPL }|inherits|is)\\b`,
	end:   lookaheads([`\\b(extends|${ IMPL }|inherits|is)\\b`, DELIMS.BLOCK[0]]),
	beginCaptures: {
		0: {name: pattern_name('storage.modifier')},
	},
	patterns: [
		{include: '#TypeCall'},
		identifier('entity.other.inherited-class'),
		{
			name: pattern_name('punctuation.separator'),
			match: ',',
		},
	],
};


export const TYPE__INTERFACE = {
	name: pattern_name('meta.type.interface'),
	begin: '\\b(interface)\\b',
	end:   lookbehinds([BLOCK_END]),
	beginCaptures: {
		0: {name: pattern_name('storage.type')},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#Heritage'},
		{include: '#ClassBody'},
		{
			name: pattern_name('storage.modifier'),
			match: '\\b(data)\\b',
		},
	],
};


export const EXPRESSION__CLASS = {
	name: pattern_name('meta.expression.class'),
	begin: '\\b(class)\\b',
	end:   lookbehinds([BLOCK_END]),
	beginCaptures: {
		0: {name: pattern_name('storage.type')},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#Heritage'},
		{include: '#Captures'},
		{include: '#ClassBody'},
		{
			name: pattern_name('storage.modifier'),
			match: '\\b(final|abstract|enum|data)\\b',
		},
	],
};


export const DECLARATION__CLASS = {
	name: pattern_name('meta.declaration.class'),
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(class)\\b`]),
	end:   lookbehinds([BLOCK_END]),
	patterns: [
		{include: '#GenericParameters'},
		{include: '#Captures'},
		{include: '#Heritage'},
		{include: '#ClassBody'},
		{
			name: pattern_name('storage.type'),
			match: '\\b(class)\\b',
		},
		{
			name:  pattern_name('storage.modifier'),
			match: `\\b(${ COMP_ACCESS }|final|abstract|enum|data|${ NOMINAL })\\b`,
		},
		{include: '#IdentifierClass'}, // must come after keywords
	],
};


export const DECLARATION__INTERFACE = {
	name: pattern_name('meta.declaration.interface'),
	begin: lookaheads([`(${ COMP_ACCESS }${ OWS })?\\b(interface)\\b`]),
	end:   lookbehinds([BLOCK_END]),
	patterns: [
		{include: '#GenericParameters'},
		{include: '#Heritage'},
		{include: '#ClassBody'},
		{
			name: pattern_name('storage.type'),
			match: '\\b(interface)\\b',
		},
		{
			name:  pattern_name('storage.modifier'),
			match: `\\b(${ COMP_ACCESS }|data|${ NOMINAL })\\b`,
		},
		{include: '#IdentifierClass'}, // must come after keywords
	],
};


export const CONSTRUCTOR_FIELD = {
	name: pattern_name('meta.field'),
	begin: lookaheads([FIELD_CONSTRUCTOR]),
	end:   lookaheads([',', DELIMS.PARAMS_FN[1]]),
	patterns: [
		{
			name:  pattern_name('storage.modifier'),
			match: `${ MEMB_ACCESS }|${ OVR }|${ PERMISSION }|${ UNFIXED }`,
		},
		{
			name:  pattern_name('punctuation.delimiter'),
			match: ASSN_START,
		},
		{include: '#IdentifierProperty'},
		{include: '#DestructureParameter'},
		annotation(lookaheads([DFLT_START, ',', DELIMS.PARAMS_FN[1]])),
		assignment(DFLT_START, lookaheads([',', DELIMS.PARAMS_FN[1]])),
	],
};


export const MEMBER__FIELD = {
	name: pattern_name('meta.field'),
	begin: lookaheads([FIELD]),
	end:   ';',
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{
			name:  pattern_name('storage.modifier'),
			match: `${ MEMB_ACCESS }|${ OVR_CLAIM }|${ PERMISSION }`,
		},
		{include: '#IdentifierProperty'},
		annotation(lookaheads([ASSN_START, ';'])),
		assignment(ASSN_START, lookaheads([';'])),
	],
};


export const MEMBER__CONSTRUCTOR = {
	name: pattern_name('meta.constructor'),
	begin: lookaheads([CONSTRUCTOR]),
	end:   [lookbehinds([BLOCK_END]), ';'].join('|'),
	patterns: [
		{
			name:  pattern_name('storage.modifier'),
			match: `\\b(${ MEMB_ACCESS }|new)\\b`,
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#ConstructorParameters'},
		{include: '#Block'},
	],
};


export const MEMBER__CONSTRUCTORGROUP = {
	name: pattern_name('meta.constructorgroup'),
	begin: lookaheads([CONSTRUCTORGROUP]),
	end:   lookbehinds([BLOCK_END]),
	patterns: [
		{
			name:  pattern_name('storage.modifier'),
			match: `\\b(${ MEMB_ACCESS }|new)\\b`,
		},
		{
			name: pattern_name('meta.constructorgroupbody'),
			begin: DELIMS.BLOCK[0],
			end:   DELIMS.BLOCK[1],
			captures: {
				0: {name: pattern_name('punctuation.delimiter')},
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
	name: pattern_name('meta.method'),
	begin: lookaheads([METHOD]),
	end:   [lookbehinds([BLOCK_END]), ';'].join('|'),
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{
			name:  pattern_name('storage.modifier'),
			match: `\\b(${ MEMB_ACCESS }|${ OVR_CLAIM }|final|${ MUTABLE })\\b`,
		},
		{include: '#IdentifierProperty'},
		{include: '#GenericParameters'},
		{include: '#Parameters'},
		{include: '#Block'},
		annotation(lookaheads([DELIMS.BLOCK[0], FATARROW, ';']), true),
		implicitReturn(),
	],
};


export const MEMBER__METHODGROUP = {
	name: pattern_name('meta.methodgroup'),
	begin: lookaheads([METHODGROUP]),
	end:   lookbehinds([BLOCK_END]),
	patterns: [
		{
			name:  pattern_name('storage.modifier'),
			match: `\\b(${ MEMB_ACCESS }|${ OVR_CLAIM }|final)\\b`,
		},
		{include: '#IdentifierProperty'},
		{
			name: pattern_name('meta.methodgroupbody'),
			begin: DELIMS.BLOCK[0],
			end:   DELIMS.BLOCK[1],
			captures: {
				0: {name: pattern_name('punctuation.delimiter')},
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
	name: pattern_name('meta.classbody'),
	begin: DELIMS.BLOCK[0],
	end:   DELIMS.BLOCK[1],
	captures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#MemberField'},
		{include: '#MemberConstructor'},
		{include: '#MemberConstructorgroup'},
		{include: '#MemberMethod'},
		{include: '#MemberMethodgroup'},
	],
};
