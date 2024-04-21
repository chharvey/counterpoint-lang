import {
	UNFIXED,
	NOMINAL,
	MUTABLE,
	VARIANCE,
} from '../selectors.js';


export const MODIFIERS__DECLARATION__TYPE = {
	patterns: [
		{
			name:  'storage.modifier.cp',
			match: NOMINAL,
		},
	],
};


export const MODIFIERS__DECLARATION__LET = {
	patterns: [
		{
			name:  'storage.modifier.cp',
			match: UNFIXED,
		},
	],
};


export const MODIFIERS__GENERIC_PARAMETER = {
	patterns: [
		{include: '#ModifiersDeclarationType'},
		{
			name:  'storage.modifier.cp',
			match: MUTABLE,
		},
		{
			name: 'storage.modifier.cp',
			match: VARIANCE,
		},
	],
};


export const MODIFIERS__PARAMETER = {
	patterns: [
		{include: '#ModifiersDeclarationLet'},
	],
};
