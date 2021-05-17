import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	OWS,
} from '../selectors.js';
import {
	list,
	propertyOrArgumentLabel,
} from './_helpers.js';



export const ARGUMENTS = list('meta.arguments.cp', '\\(', '\\)', [
	{
		name: 'keyword.other.spread.cp',
		match: '##|#',
	},
	propertyOrArgumentLabel('\\)', '#IdentifierParameter', '#DestructureArgument'),
	{include: '#Expression'}, // must come after argument destructuring because of untyped lambda parameters
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
