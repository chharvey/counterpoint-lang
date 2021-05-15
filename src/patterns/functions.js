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
	FUNCTION,
} from '../selectors.js';
import {
	identifier,
	annotation,
	assignment,
} from './_helpers.js';



export const TYPE__FUNCTION = {
	name: 'meta.type.func.cp',
	begin: lookaheads([
		'<',
		`\\(${ OWS }\\)`,
		`\\(${ OWS }${ VAR }${ OWS }\\??${ ANNO_START }`,
		`${ lookbehinds(['\\)']) }${ OWS }${ TYPEARROW }`,
	]),
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
		{include: '#PromiseType'},
	],
};


export const EXPRESSION__FUNCTION = {
	name: 'meta.expression.func.cp',
	begin: lookaheads([FUNCTION]),
	end: [lookaheads(['\\{']), ARROW].join('|'),
	endCaptures: {
		0: {name: 'storage.type.cp'},
	},
	patterns: [
		{include: '#CommentBlock'},
		{include: '#CommentLine'},
		{include: '#Captures'},
		{include: '#GenericParameters'},
		{include: '#Parameters'},
		annotation(lookaheads(['\\{', ARROW])),
	],
};


export const STATEMENT__DECLARATION__FUNC = {
	name: 'meta.declaration.func.cp',
	begin: '\\b(func)\\b',
	end:   [lookaheads(['\\{']), ARROW].join('|'),
	captures: {
		0: {name: 'storage.type.cp'},
	},
	patterns: [
		{include: '#Captures'},
		{include: '#GenericParameters'},
		{include: '#Parameters'},
		annotation(lookaheads(['\\{', ARROW])),
		identifier('entity.name.function'),
	],
};


export const CAPTURES = {
	name: 'meta.captures.cp',
	begin: '\\[',
	end:   '\\]',
	captures: {
		0: {name: 'punctuation.delimiter.cp'},
	},
	patterns: [
		{
			name: 'punctuation.separator.cp',
			match: ',',
		},
		identifier(),
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
		annotation(lookaheads([',', '\\)']), true),
		{include: '#IdentifierParameter'},
	],
};


export const PARAMETER_PATTERNS = {
	patterns: [
		{
			name: 'keyword.other.alias.cp',
			match: '\\b(as)\\b',
		},
		{include: '#DestructureParameter'},
		annotation(lookaheads([ASSN_START, ',', '\\)'])),
		assignment(lookaheads([',', '\\)'])),
		{include: '#IdentifierParameter'},
	],
};


export const GENERIC_PARAMETERS = {
	name: 'meta.genericparameters.cp',
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
		{include: '#GenericParameterPatterns'},
	],
};


export const TYPE_PARAMETERS = {
	name: 'meta.parameters.cp',
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
		{include: '#TypeParameterPatterns'},
	],
};


export const PARAMETERS = {
	name: 'meta.parameters.cp',
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
		{include: '#ParameterPatterns'},
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
	begin: lookaheads([[VAR, OWS, '\\??', ANNO_START].join('')]),
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
	begin: lookaheads([[VAR, OWS, `(${ [
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
