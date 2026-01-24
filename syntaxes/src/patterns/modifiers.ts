import {pattern_name} from '../helpers.ts';
import {
	UNFIXED,
	NOMINAL,
	MUTABLE,
	VARIANCE,
} from '../selectors.ts';


export const MODIFIERS__DECLARATION__TYPE = {
	patterns: [
		{
			name:  pattern_name('storage.modifier'),
			match: NOMINAL,
		},
	],
};


export const MODIFIERS__DECLARATION__VARIABLE = {
	patterns: [
		{
			name:  pattern_name('storage.modifier'),
			match: UNFIXED,
		},
	],
};


export const MODIFIERS__GENERIC_PARAMETER = {
	patterns: [
		{include: '#ModifiersDeclarationType'},
		{
			name:  pattern_name('storage.modifier'),
			match: `${ MUTABLE }|${ VARIANCE }`,
		},
	],
};


export const MODIFIERS__PARAMETER = {
	patterns: [
		{include: '#ModifiersDeclarationVariable'},
	],
};
