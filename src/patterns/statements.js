import {
	pattern_name,
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
	VAR,
	IMPL,
	ANNO_START,
	ASSN_START,
	THINARROW,
	BLOCK_END,
} from '../selectors.js';
import {
	list,
	annotation,
	assignment,
	func_heritage,
} from './_helpers.js';



export const STATEMENT__CLAIM = {
	name:  pattern_name('meta.statement.claim'),
	begin: '\\b(claim)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('keyword.control')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		func_heritage(lookaheads([';'])),
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


export const STATEMENT__SET = {
	name:  pattern_name('meta.statement.set'),
	begin: '\\b(set)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('keyword.control')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#ExpressionAssignee'},
		assignment(`${ ASSN_START }|(&&|\\|\\||![&|]|[\\^*/+-])=`, lookaheads([';'])),
	],
};


export const STATEMENT__DELETE = {
	name:  pattern_name('meta.statement.delete'),
	begin: '\\b(delete)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('keyword.control')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#ExpressionAssignee'},
	],
};


export const STATEMENT__CONDITIONAL = {
	name:          pattern_name('meta.statement.conditional'),
	begin:         '\\b(if|unless)\\b',
	end:           ';',
	beginCaptures: {0: {name: pattern_name('keyword.control')}},
	endCaptures:   {0: {name: pattern_name('punctuation.delimiter')}},
	patterns:      [
		{
			name:  pattern_name('keyword.control'),
			match: '\\b(then|else|if)\\b',
		},
		{include: '#Block'},
		{include: '#Expression'},
	],
};


export const STATEMENT__LOOP = {
	name:  pattern_name('meta.statement.loop'),
	begin: '\\b(while|until|do)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('keyword.control')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{
			name: pattern_name('keyword.control'),
			match: '\\b(do|while|until)\\b',
		},
		{include: '#Block'},
		{include: '#Expression'},
	],
};


export const STATEMENT__ITERATION = {
	name:  pattern_name('meta.statement.iteration'),
	begin: '\\b(for)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('keyword.control')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#DestructureVariable'},
		annotation(lookaheads(['\\b(in)\\b'])),
		{
			begin: '\\b(in)\\b',
			end:   lookaheads(['\\b(do)\\b']),
			beginCaptures: {
				0: {name: pattern_name('keyword.control')},
			},
			patterns: [
				{include: '#Expression'},
			],
		},
		{
			begin: '\\b(do)\\b',
			end:   lookbehinds([BLOCK_END]),
			beginCaptures: {
				0: {name: pattern_name('keyword.control')},
			},
			patterns: [
				{include: '#CommentBlock'},
				{include: '#CommentLine'},
				{include: '#Block'},
			],
		},
		{include: '#IdentifierVariable'}, // must come after keywords
	],
};


export const STATEMENT__BREAK = {
	name: pattern_name('meta.statement.break'),
	begin: '\\b(break|skip|return|throw)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('keyword.control')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [{include: '#Expression'}],
};


export const STATEMENT = {
	patterns: [
		{include: '#Declaration'},
		{include: '#StatementClaim'},
		{include: '#StatementSet'},
		{include: '#StatementDelete'},
		{include: '#StatementConditional'},
		{include: '#StatementLoop'},
		{include: '#StatementIteration'},
		{include: '#StatementBreak'},
		{include: '#Expression'},
		{
			name: pattern_name('punctuation.delimiter'),
			match: ';',
		},
	],
};


export const BLOCK = {
	name: pattern_name('meta.block'),
	begin: DELIMS.BLOCK[0],
	end:   DELIMS.BLOCK[1],
	captures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{
			// used only for set/map literal expressions where blocks could be, e.g. `if a then {b} else {c -> d};`
			patterns: [
				{
					name: pattern_name('keyword.other.spread'),
					match: '#',
				},
				{
					name: pattern_name('punctuation.separator'),
					match: ',',
				},
				{
					name: pattern_name('keyword.operator.punctuation'),
					match: THINARROW,
				},
			],
		},
		{include: '#Statement'},
	],
};
