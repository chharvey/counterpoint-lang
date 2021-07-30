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
	assignment,
	control,
} from './_helpers.js';



export const STATEMENT__CONTROL = {
	patterns: [
		control(['if', 'unless'], ['then', 'else', 'if', 'unless']),
		control(['while', 'until', 'do'], ['do', 'while', 'until']),
		control(['for'], ['from', 'to', 'by', 'in', 'do']),
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


export const STATEMENT = {
	patterns: [
		{include: '#StatementControl'},
		{include: '#StatementAugmentation'},
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
