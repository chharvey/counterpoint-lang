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
	list,
	assignment,
} from './_helpers.js';



export const ARGUMENTS = list('meta.arguments.cp', '\\(', '\\)', [
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
]);


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
