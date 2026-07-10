import {
	pattern_name,
	lookbehinds,
	R,
} from '../helpers.ts';
import {
	DELIMS,
	ALIAS,
} from '../selectors.ts';
import {list} from './_helpers.ts';



export const MODULE__INNER = {
	name:          pattern_name('meta.declaration.module'),
	begin:         R.w('module'),
	end:           lookbehinds([DELIMS.BLOCK[1]]),
	beginCaptures: {0: {name: pattern_name('storage.type')}},
	patterns:      [
		{include: '#String'},
		{
			name:     pattern_name('meta.module'),
			begin:    DELIMS.BLOCK[0],
			end:      DELIMS.BLOCK[1],
			captures: {0: {name: pattern_name('punctuation.delimiter')}},
			patterns: [{include: '#SourceFile'}],
		},
	],
};


export const MODULE__IMPORT = {
	name: pattern_name('meta.import'),
	begin: R.w('from'),
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('keyword.control')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{
			name: pattern_name('keyword.control'),
			match: R.w(R.c('import', 'type', 'await', 'all')),
		},
		{
			name: pattern_name('keyword.other.alias'),
			match: ALIAS,
		},
		{include: '#String'},
		{include: '#IdentifierVariable'},
		list('meta.import.list', DELIMS.IMPORT[0], DELIMS.IMPORT[1], [
			{
				name: pattern_name('keyword.control'),
				match: R.w(R.c('type', 'await')),
			},
			{
				name: pattern_name('keyword.other.alias'),
				match: ALIAS,
			},
			{include: '#IdentifierVariable'},
		]),
	],
};


export const MODULE__EXPORT = {
	name: pattern_name('meta.export'),
	begin: R.w('export'),
	end:   ';',
	beginCaptures: {
		0: {name: pattern_name('keyword.control')},
	},
	endCaptures: {
		0: {name: pattern_name('punctuation.delimiter')},
	},
	patterns: [
		{
			name: pattern_name('keyword.other.alias'),
			match: ALIAS,
		},
		{include: '#String'},
		{include: '#IdentifierVariable'},
	],
};
