import {
	lookaheads,
	lookbehinds,
} from '../helpers.js';
import {
	OWS,
	VAR,
	ANNO_START,
	ASSN_START,
	TYPEARROW,
	ARROW,
	FUNCTIONTYPE,
	FUNCTION,
} from '../selectors.js';
import {
	annotation,
	assignment,
	implicitReturn,
} from './_helpers.js';



export const TYPE__FUNCTION = {
	name: 'meta.type.func.cp',
	begin: lookaheads([FUNCTIONTYPE]),
	end: lookbehinds(['\\}']),
	patterns: [
		{
			name: 'keyword.operator.punctuation.cp',
			match: TYPEARROW,
		},
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#GenericParameters'},
		{include: '#TypeParameters'},
		{include: '#TypeStructurePromise'},
	],
};


export const EXPRESSION__FUNCTION = {
	name: 'meta.expression.func.cp',
	begin: lookaheads([FUNCTION]),
	end:   [lookbehinds(['\\}']), ARROW].join('|'),
	endCaptures: {
		0: {name: 'storage.type.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#Captures'},
		{include: '#GenericParameters'},
		{include: '#Parameters'},
		{include: '#Block'},
		annotation(lookaheads(['\\{', ARROW])),
	],
};


export const DECLARATION__FUNC = {
	name: 'meta.declaration.func.cp',
	begin: lookaheads([`(\\b(public|private)\\b${ OWS })?\\b(func)\\b`]),
	end:   [lookbehinds(['\\}']), ';'].join('|'),
	endCaptures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{include: '#GenericParameters'},
		{include: '#Captures'},
		{include: '#Parameters'},
		{include: '#Block'},
		{
			name: 'meta.heritage.cp',
			begin: '\\b(implements)\\b',
			end:   lookaheads(['\\[', '\\(']),
			beginCaptures: {
				0: {name: 'storage.modifier.cp'},
			},
			patterns: [
				{include: '#TypeCall'},
				{include: '#IdentifierType'},
			],
		},
		annotation(lookaheads(['\\{', ARROW])),
		implicitReturn(),
		{
			name: 'storage.modifier.cp',
			match: '\\b(public|private)\\b',
		},
		{
			name: 'storage.type.cp',
			match: '\\b(func)\\b',
		},
		{include: '#IdentifierFunction'}, // must come after keywords
	],
};


export const GENERIC_PARAMETER_PATTERNS = {
	patterns: [
		{
			name: 'meta.heritage.cp',
			begin: '\\b(narrows|widens)\\b',
			end: lookaheads([ASSN_START, ',', '>']),
			beginCaptures: {
				0: {name: 'keyword.modifier.cp'},
			},
			patterns: [
				{include: '#Type'},
			],
		},
		assignment(lookaheads([',', '>']), '#Type'),
		{include: '#IdentifierParameter'},
	],
};


export const TYPE_PARAMETER_PATTERNS = {
	patterns: [
		annotation(lookaheads([',', '\\)'])),
		{
			begin: lookaheads([`${ VAR }${ OWS }${ ANNO_START }`]),
			end:   lookaheads([ANNO_START]),
			patterns: [
				{include: '#IdentifierParameter'},
			],
		},
		{include: '#Type'}, // must come after `variable.parameter.cp` so that it isn’t confused with `entity.name.type.cp`
	],
};


export const PARAMETER_PATTERNS = {
	patterns: [
		{
			name: 'storage.modifier.cp',
			match: '\\b(unfixed)\\b',
		},
		{
			name: 'keyword.other.alias.cp',
			match: '\\b(as)\\b',
		},
		{include: '#IdentifierParameter'},
		{include: '#DestructureParameter'},
		annotation(lookaheads([ASSN_START, ',', '\\)'])),
		assignment(lookaheads([',', '\\)'])),
	],
};


/** Generic parameter, if on separate line. */
export const POSSIBLE_GENERIC_PARAMETER = {
	begin: lookaheads([[VAR, OWS, `(${ [
		'\\b(narrows|widens)\\b', ASSN_START, ',', // annotated, or more than 1 generic parameter
	].join('|') })`].join('')]),
	end: `,|${ lookaheads(['>']) }`,
	endCaptures: {
		0: {name: 'punctuation.separator.cp'},
	},
	patterns: [
		{include: '#GenericParameterPatterns'},
	],
};


/** Parameter of function type, if on separate line. */
export const POSSIBLE_TYPE_PARAMETER = {
	begin: lookaheads([`(${ VAR }${ OWS })?${ ANNO_START }`]),
	end:   `,|${ lookaheads(['\\)']) }`,
	endCaptures: {
		0: {name: 'punctuation.separator.cp'},
	},
	patterns: [
		{include: '#TypeParameterPatterns'},
	],
};


/** Parameter of function expression, if on separate line. */
export const POSSIBLE_PARAMETER = {
	begin: lookaheads([[`(\\b(unfixed)\\b${ OWS })?`, VAR, OWS, `(${ [
		ANNO_START, ASSN_START, ',', '\\b(as)\\b', // annotated, or assigned, or more than 1 parameter, or destructured
	].join('|') })`].join('')]),
	end: `,|${ lookaheads(['\\)']) }`,
	endCaptures: {
		0: {name: 'punctuation.separator.cp'},
	},
	patterns: [
		{include: '#ParameterPatterns'},
	],
};
