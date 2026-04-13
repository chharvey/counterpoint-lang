import {
	pattern_name,
	lookaheads,
	lookbehinds,
	R,
} from '../helpers.ts';
import {
	DELIMS,
	OWS,
	COMP_ACCESS,
	MEMB_ACCESS,
	UNFIXED,
	NOMINAL,
	MUTABLE,
	OPT,
	PERMISSION,
	IMPL,
	OVR,
	OVR_CLAIM,
	CAPTURE,
	ASSN_START,
	FATARROW,
	BLOCK_END,
	FIELD,
	FIELD_CONSTRUCTOR,
	CONSTRUCTOR,
	CONSTRUCTORGROUP,
	METHOD,
	METHODGROUP,
} from '../selectors.ts';
import {
	qualified_name,
	label,
	annotation,
	assignment,
	implicitReturn,
} from './_helpers.ts';



export const CLASS_HERITAGE = {
	name:  pattern_name('meta.heritage'),
	begin: R.w(R.c('extends', IMPL, 'inherits', 'is')),
	end:   lookaheads([R.w(R.c('extends', IMPL, 'inherits', 'is')), CAPTURE, DELIMS.BLOCK[0]]),
	beginCaptures: {
		0: {name: pattern_name('storage.modifier')},
	},
	patterns: [
		{include: '#TypeAccess'},
		{include: '#TypeCall'},
		qualified_name('entity.other.inherited-class'),
		{
			name: pattern_name('punctuation.separator'),
			match: ',',
		},
	],
};


export const TYPE__INTERFACE = {
	name: pattern_name('meta.type.interface'),
	begin: R.w('interface'),
	end:   lookbehinds([BLOCK_END]),
	beginCaptures: {
		0: {name: pattern_name('storage.type')},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#ClassHeritage'},
		{include: '#ClassBody'},
		{
			name: pattern_name('storage.modifier'),
			match: R.w('data'),
		},
	],
};


export const EXPRESSION__CLASS = {
	name: pattern_name('meta.expression.class'),
	begin: R.w('class'),
	end:   lookbehinds([BLOCK_END]),
	beginCaptures: {
		0: {name: pattern_name('storage.type')},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#ClassHeritage'},
		{include: '#Captures'},
		{include: '#ClassBody'},
		{
			name: pattern_name('storage.modifier'),
			match: R.w(R.c('final', 'abstract', 'enum', 'data')),
		},
	],
};


export const DECLARATION__CLASS = {
	name: pattern_name('meta.declaration.class'),
	begin: lookaheads([R.s(R.o(R.s(COMP_ACCESS, OWS)), R.w('class'))]),
	end:   lookbehinds([BLOCK_END]),
	patterns: [
		{include: '#GenericParameters'},
		{include: '#ClassHeritage'},
		{include: '#Captures'},
		{include: '#ClassBody'},
		{
			name: pattern_name('storage.type'),
			match: R.w('class'),
		},
		{
			name:  pattern_name('storage.modifier'),
			match: R.w(R.c(COMP_ACCESS, 'final', 'abstract', 'enum', 'data', NOMINAL)),
		},
		{include: '#IdentifierClass'}, // must come after keywords
	],
};


export const DECLARATION__INTERFACE = {
	name: pattern_name('meta.declaration.interface'),
	begin: lookaheads([R.s(R.o(R.s(COMP_ACCESS, OWS)), R.w('interface'))]),
	end:   lookbehinds([BLOCK_END]),
	patterns: [
		{include: '#GenericParameters'},
		{include: '#ClassHeritage'},
		{include: '#ClassBody'},
		{
			name: pattern_name('storage.type'),
			match: R.w('interface'),
		},
		{
			name:  pattern_name('storage.modifier'),
			match: R.w(R.c(COMP_ACCESS, 'data', NOMINAL)),
		},
		{include: '#IdentifierClass'}, // must come after keywords
	],
};


export const CONSTRUCTOR_FIELD = {
	name: pattern_name('meta.field'),
	begin: lookaheads([FIELD_CONSTRUCTOR]),
	end:   lookaheads([',', DELIMS.PARAMS_FN[1]]),
	patterns: [
		{include: '#DestructureParameter'},
		{
			name:  pattern_name('storage.modifier'),
			match: R.c(MEMB_ACCESS, OVR, PERMISSION, UNFIXED),
		},
		{
			name:  pattern_name('keyword.other.optional'),
			match: OPT,
		},
		label(ASSN_START, '#IdentifierProperty'),
		annotation(lookaheads([ASSN_START, ',', DELIMS.PARAMS_FN[1]])),
		assignment(lookaheads([',', DELIMS.PARAMS_FN[1]])),
		{include: '#IdentifierProperty'},
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
			match: R.c(MEMB_ACCESS, OVR_CLAIM, PERMISSION),
		},
		{
			name:  pattern_name('keyword.other.optional'),
			match: OPT,
		},
		{include: '#IdentifierProperty'},
		annotation(lookaheads([ASSN_START, ';'])),
		assignment(lookaheads([';'])),
	],
};


export const MEMBER__CONSTRUCTOR = {
	name: pattern_name('meta.constructor'),
	begin: lookaheads([CONSTRUCTOR]),
	end:   R.c(lookbehinds([BLOCK_END]), ';'),
	patterns: [
		{
			name:  pattern_name('storage.modifier'),
			match: R.w(R.c(MEMB_ACCESS, 'new')),
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
			match: R.w(R.c(MEMB_ACCESS, 'new')),
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
	end:   R.c(lookbehinds([BLOCK_END]), ';'),
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{
			name:  pattern_name('storage.modifier'),
			match: R.w(R.c(MEMB_ACCESS, OVR_CLAIM, 'final', MUTABLE)),
		},
		{
			name:  pattern_name('keyword.other.optional'),
			match: OPT,
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
			match: R.w(R.c(MEMB_ACCESS, OVR_CLAIM, 'final')),
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
