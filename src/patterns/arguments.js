import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	OWS,
	VAR,
	ASSN_START,
	DESTRUCTURE_PROPERTIES_OR_ARGUMENTS,
} from '../selectors.js';
import {
	assignment,
} from './_helpers.js';



export const GENERIC_ARGUMENTS = {
	name: 'meta.genericarguments.cp',
	begin: '<',
	end:   '>',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'punctuation.separator.cp',
			match: ',',
		},
		{include: '#Type'},
	],
};


export const ARGUMENTS = {
	name: 'meta.arguments.cp',
	begin: '\\(',
	end:   '\\)',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'punctuation.separator.cp',
			match: ',',
		},
		{
			begin: lookaheads([[VAR, OWS, '\\$'].join('')]),
			end:   lookaheads([',', '\\)']),
			patterns: [
				{
					name: 'keyword.other.alias.cp',
					match: '\\$',
				},
				{include: '#IdentifierArgument'},
			],
		},
		{
			begin: lookaheads([
				[`(${ VAR }|${ DESTRUCTURE_PROPERTIES_OR_ARGUMENTS })`, OWS, ASSN_START].join(''),
			]),
			end: lookaheads([',', '\\)']),
			patterns: [
				{include: '#DestructureArgument'},
				assignment(lookaheads([',', '\\)'])),
				{include: '#IdentifierArgument'},
			],
		},
		{
			name: 'keyword.other.spread.cp',
			match: '##|#',
		},
		{include: '#Expression'},
	],
};


export const TYPE_ACCESS = {
	name: 'meta.type.access.cp',
	begin: ['(\\.)', lookaheads([[OWS, '<'].join('')])].join(''),
	end:   lookbehinds(['>']),
	beginCaptures: {
		1: {name: 'keyword.operator.punctuation.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#GenericArguments'},
	],
};
