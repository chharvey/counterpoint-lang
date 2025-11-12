import {pattern_name} from '../helpers.js';
import {
	DELIMS,
	ALIAS,
} from '../selectors.js';
import {list} from './_helpers.js';



export const MODULE__IMPORT = {
	name: pattern_name('meta.import'),
	begin: '\\b(from)\\b',
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
			match: '\\b(import|type|await|all)\\b',
		},
		{
			name: pattern_name('keyword.other.alias'),
			match: ALIAS,
		},
		{include: '#String'},
		{include: '#IdentifierVariable'},
		list('meta.import.list', DELIMS.GROUPING[0], DELIMS.GROUPING[1], [
			{
				name: pattern_name('keyword.control'),
				match: '\\b(type|await)\\b',
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
	begin: '\\b(export)\\b',
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
