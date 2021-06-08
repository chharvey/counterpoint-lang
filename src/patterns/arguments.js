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
