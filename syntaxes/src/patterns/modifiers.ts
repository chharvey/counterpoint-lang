import {
	pattern_name,
	R,
} from '../helpers.ts';
import {
	WRITABLE,
	NOMINAL,
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
			match: WRITABLE,
		},
	],
};


export const MODIFIERS__GENERIC_PARAMETER = {
	patterns: [
		{
			name:  pattern_name('storage.modifier'),
			match: VARIANCE,
		},
		{include: '#ModifiersDeclarationType'},
	],
};


export const MODIFIERS__PARAMETER = {
	patterns: [
		{include: '#ModifiersDeclarationVariable'},
	],
};
