import {
	pattern_name,
	lookaheads,
	lookbehinds,
	R,
} from '../helpers.ts';
import {
	DELIMS,
	OWS,
	VAR,
	IMPL,
	ANNO_START,
	ASSN_START,
	THINARROW,
	BLOCK_END,
} from '../selectors.ts';
import {
	annotation,
	assignment,
	func_heritage,
} from './_helpers.ts';



export const STATEMENT__CLAIM = {
	name:  pattern_name('meta.statement.claim'),
	begin: R.w('claim'),
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
			begin: lookaheads([R.s(VAR, OWS, R.c(DELIMS.PARAMS_GN[0], DELIMS.PARAMS_FN[0]))]),
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
	begin: R.w('set'),
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('keyword.control')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#ExpressionAssignee'},
		assignment(lookaheads([';']), false, R.c(ASSN_START, '(&&|\\|\\||![&|]|[\\^*/+-])=')),
	],
};


export const STATEMENT__DELETE = {
	name:  pattern_name('meta.statement.delete'),
	begin: R.w('delete'),
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
	begin:         R.w(R.c('if', 'unless')),
	end:           ';',
	beginCaptures: {0: {name: pattern_name('keyword.control')}},
	endCaptures:   {0: {name: pattern_name('punctuation.delimiter')}},
	patterns:      [
		{
			name:  pattern_name('keyword.control'),
			match: R.w(R.c('then', 'else', 'if')),
		},
		{include: '#Block'},
		{include: '#Expression'},
	],
};


export const STATEMENT__LOOP = {
	name:  pattern_name('meta.statement.loop'),
	begin: R.w(R.c('while', 'until', 'do')),
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
			match: R.w(R.c('do', 'while', 'until')),
		},
		{include: '#Block'},
		{include: '#Expression'},
	],
};


export const STATEMENT__ITERATION = {
	name:  pattern_name('meta.statement.iteration'),
	begin: R.w('for'),
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('keyword.control')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{include: '#DestructureVariable'},
		annotation(lookaheads([R.w('in')])),
		{
			begin: R.w('in'),
			end:   lookaheads([R.w('do')]),
			beginCaptures: {
				0: {name: pattern_name('keyword.control')},
			},
			patterns: [
				{include: '#Expression'},
			],
		},
		{
			begin: R.w('do'),
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
	begin: R.w(R.c('break', 'skip', 'return', 'throw')),
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
