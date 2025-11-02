export function digits(charclass, base = '') {
	return `${ (base) ? `(\\\\${ base })` : '' }(?:${ charclass }_?)*${ charclass }`;
}

export function lookaheads(aheads = [], negative = false) {
	return `(?${ (negative) ? '!' : '=' }${ aheads.join('|') })`;
}

export function lookbehinds(behinds = [], negative = false) {
	return `(?<${ (negative) ? '!' : '=' }${ behinds.join('|') })`;
}
