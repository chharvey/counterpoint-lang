import {
	lookaheads,
} from '../helpers.js';
import {
	OWS,
	ASSN_START,
	BLOCK_END,
	DESTRUCTURE_ASSIGNEES,
} from '../selectors.js';
import {
	list,
	assignment,
	control,
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
			end:   lookaheads(['\\b(else)\\b']),
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
		control(['while', 'until', 'do'], ['do', 'while', 'until']),
		control(['for'], ['from', 'to', 'by', 'in', 'do']),
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
			name: 'meta.control.cp',
			begin: `\\b(continue)\\b`,
			end:   ';',
			beginCaptures: {
				0: {name: 'keyword.control.cp'},
			},
			endCaptures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
		},
		{
			name: 'meta.control.cp',
			begin: `\\b(break|return|throw)\\b`,
			end:   ';',
			beginCaptures: {
				0: {name: 'keyword.control.cp'},
			},
			endCaptures: {
				0: {name: 'punctuation.delimiter.cp'},
			},
			patterns: [
				{include: '#Expression'},
			],
		},
	],
};


export const STATEMENT__AUGMENTATION = {
	name: 'meta.augmentation.cp',
	begin: '&&=|!&=|\\|\\|=|!\\|=|\\^=|\\*=|\\/=|\\+=|-=|\\+\\+|--|\\*\\*|\\/\\/',
	end: lookaheads([';']),
	beginCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#Expression'},
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
		list('meta.import.list', '\\(', '\\)', [
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
		{include: '#String'},
	],
};


export const STATEMENT = {
	patterns: [
		{include: '#StatementControl'},
		{include: '#StatementAugmentation'},
		{include: '#StatementImport'},
		{include: '#StatementExport'},
		assignment(lookaheads([';'])),
		{
			name: 'punctuation.delimiter.cp',
			match: ';',
		},
		{
			begin: lookaheads([
				[DESTRUCTURE_ASSIGNEES, OWS, ASSN_START].join(''),
			]),
			end: lookaheads([ASSN_START]),
			patterns: [
				{include: '#CommentBlock'},
				{include: '#DestructureAssignment'},
			],
		},
		{include: '#Expression'}, // must come after reassignment destructuring because of untyped lambda parameters
	],
};


export const BLOCK = {
	name: 'meta.block.cp',
	begin: '\\{',
	end:   BLOCK_END,
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#Declaration'},
		{include: '#Statement'},
		{
			// used only for set literal expressions
			name: 'punctuation.separator.cp',
			match: ',',
		},
	],
};
