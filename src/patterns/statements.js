import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	DELIMS,
	OWS,
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
				0: {name: 'keyword.control.cp'},
			},
			patterns: [
				{include: '#Expression'},
			],
		},
		{
			begin: '\\b(then)\\b',
			end:   lookaheads(['\\b(else)\\b', ';']),
			beginCaptures: {
				0: {name: 'keyword.control.cp'},
			},
			patterns: [
				{include: '#Block'},
				{include: '#Expression'}, // include #Expression in case this isn’t a control statement but a conditional expression statement
			],
		},
		{
			begin: '\\b(else)\\b',
			end:   lookaheads([';']),
			beginCaptures: {
				0: {name: 'keyword.control.cp'},
			},
			patterns: [
				{include: '#StatementControlConditional'},
				{include: '#Block'},
				{include: '#Expression'}, // include #Expression in case this isn’t a control statement but a conditional expression statement
			],
		},
	],
};


export const STATEMENT__CONTROL = {
	patterns: [
		{
			name: 'meta.control.cp',
			begin: lookaheads(['\\b(if|unless)\\b']),
			end:   ';',
			endCaptures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
			patterns: [
				{include: '#StatementControlConditional'},
			]
		},
		{
			name:  'meta.control.cp',
			begin: '\\b(while|until|do)\\b',
			end:   ';',
			beginCaptures: {
				0: {name: 'keyword.control.cp'},
			},
			endCaptures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
			patterns: [
				{
					name: 'keyword.control.cp',
					match: '\\b(do|while|until)\\b',
				},
				{include: '#Block'},
				{include: '#Expression'},
			],
		},
		{
			name:  'meta.control.cp',
			begin: '\\b(for)\\b',
			end:   ';',
			beginCaptures: {
				0: {name: 'keyword.control.cp'},
			},
			endCaptures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
			patterns: [
				{include: '#CommentBlock'},
				{include: '#CommentLine'},
				{include: '#DestructureVariable'},
				annotation(lookaheads(['\\b(from|of)\\b'])),
				{
					name:  'keyword.control.cp',
					match: '\\b(await)\\b',
				},
				{
					begin: '\\b(from|to|by|of)\\b',
					end:   lookaheads(['\\b(to|by|do)\\b']),
					beginCaptures: {
						0: {name: 'keyword.control.cp'},
					},
					patterns: [
						{include: '#Expression'},
					],
				},
				{
					begin: '\\b(do)\\b',
					end:   lookbehinds(['\\}']),
					beginCaptures: {
						0: {name: 'keyword.control.cp'},
					},
					patterns: [
						{include: '#Block'},
					],
				},
				{include: '#IdentifierVariable'}, // must come after keywords
			],
		},
		{
			name: 'meta.control.cp',
			begin: '\\b(break|continue|return|yield|throw)\\b',
			end:   ';',
			beginCaptures: {
				0: {name: 'keyword.control.cp'},
			},
			endCaptures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
			patterns: [
				{
					name: 'keyword.other.spread.cp',
					match: '#',
				},
				{include: '#Expression'},
			],
		},
	],
};


export const STATEMENT__IMPORT = {
	name: 'meta.import.cp',
	begin: '\\b(from)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: 'keyword.control.cp'},
	},
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'keyword.control.cp',
			match: '\\b(import|type|await|all)\\b',
		},
		{
			name: 'keyword.other.alias.cp',
			match: '\\b(as)\\b',
		},
		{include: '#String'},
		{include: '#IdentifierVariable'},
		list('meta.import.list', DELIMS.GROUPING[0], DELIMS.GROUPING[1], [
			{
				name: 'keyword.control.cp',
				match: '\\b(type|await)\\b',
			},
			{
				name: 'keyword.other.alias.cp',
				match: '\\b(as)\\b',
			},
			{include: '#IdentifierVariable'},
		]),
	],
};


export const STATEMENT__EXPORT = {
	name: 'meta.export.cp',
	begin: '\\b(export)\\b',
	end:   ';',
	beginCaptures: {
		0: {name: 'keyword.control.cp'},
	},
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'keyword.other.alias.cp',
			match: '\\b(as)\\b',
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
			name: 'punctuation.delimiter.cp',
			match: ';',
		},
	],
};


export const BLOCK = {
	name: 'meta.block.cp',
	begin: DELIMS.BLOCK[0],
	end:   BLOCK_END,
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#Statement'},
		{
			// used only for set/map literal expressions
			patterns: [
				{
					name: 'keyword.other.spread.cp',
					match: '#',
				},
				{
					name: 'punctuation.separator.cp',
					match: ',',
				},
				{
					name: 'keyword.operator.punctuation.cp',
					match: THINARROW,
				},
			],
		},
	],
};
