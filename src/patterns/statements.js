import {
	pattern_name,
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
	ALIAS,
	ASSN_START,
	THINARROW,
	BLOCK_END,
	DESTRUCTURE_ASSIGNEES,
} from '../selectors.js';
import {
	list,
	annotation,
	assignment,
} from './_helpers.js';



export const STATEMENT__CONTROL__CONDITIONAL = {
	begin: lookaheads(['\\b(if|unless)\\b']),
	end:   lookaheads([';']),
	patterns: [
		{
			begin: '\\b(if|unless)\\b',
			end:   lookaheads(['\\b(then)\\b']),
			beginCaptures: {
				0: {name: pattern_name('keyword.control')},
			},
			patterns: [
				{include: '#Expression'},
			],
		},
		{
			begin: '\\b(then)\\b',
			end:   lookaheads(['\\b(else)\\b', ';']),
			beginCaptures: {
				0: {name: pattern_name('keyword.control')},
			},
			patterns: [
				{include: '#Block'},
				{include: '#Expression'}, // in case this isn’t a control statement but a conditional expression statement, e.g. `if a then b;`
			],
		},
		{
			begin: '\\b(else)\\b',
			end:   lookaheads([';']),
			beginCaptures: {
				0: {name: pattern_name('keyword.control')},
			},
			patterns: [
				{include: '#StatementControlConditional'},
				{include: '#Block'},
				{include: '#Expression'}, // in case this isn’t a control statement but a conditional expression statement, e.g. `if a then b else c;`
			],
		},
	],
};


export const STATEMENT__CONTROL = {
	patterns: [
		{
			name: pattern_name('meta.control'),
			begin: lookaheads(['\\b(if|unless)\\b']),
			end:   ';',
			endCaptures: {
				0: {name: pattern_name('punctuation.delimiter')},
			},
			patterns: [
				{include: '#StatementControlConditional'},
			]
		},
		{
			name:  pattern_name('meta.control'),
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
		},
		{
			name:  pattern_name('meta.control'),
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
				annotation(lookaheads(['\\b(of)\\b'])),
				{
					begin: '\\b(of)\\b',
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
		},
		{
			name: pattern_name('meta.control'),
			begin: '\\b(break|continue|return|throw)\\b',
			end:   ';',
			beginCaptures: {
				0: {name: pattern_name('keyword.control')},
			},
			endCaptures: {
				0: {name: pattern_name('punctuation.delimiter')},
			},
			patterns: [{include: '#Expression'}],
		},
	],
};


export const STATEMENT__IMPORT = {
	name: pattern_name('meta.import'),
	begin: '\\b(from)\\b',
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
			match: '\\b(import|type|await|all)\\b',
		},
		{
			name: pattern_name('keyword.other.alias'),
			match: ALIAS,
		},
		{include: '#String'},
		{include: '#IdentifierVariable'},
		list('meta.import.list', DELIMS.GROUPING[0], DELIMS.GROUPING[1], [
			{
				name: pattern_name('keyword.control'),
				match: '\\b(type|await)\\b',
			},
			{
				name: pattern_name('keyword.other.alias'),
				match: ALIAS,
			},
			{include: '#IdentifierVariable'},
		]),
	],
};


export const STATEMENT__EXPORT = {
	name: pattern_name('meta.export'),
	begin: '\\b(export)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('keyword.control')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{
			name: pattern_name('keyword.other.alias'),
			match: ALIAS,
		},
		{include: '#String'},
		{include: '#IdentifierVariable'},
	],
};


export const STATEMENT = {
	patterns: [
		{include: '#Declaration'},
		{include: '#StatementControl'},
		{include: '#StatementImport'},
		{include: '#StatementExport'},
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
