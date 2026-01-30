export function pattern_name(name: string) {
	return name.concat('.cpl');
}

export function digits(charclass: string, base = '') {
	return `${ (base) ? `(\\\\${ base })` : '' }(?:${ charclass }_?)*${ charclass }`;
}

export function lookaheads(aheads: readonly string[] = [], negative = false) {
	return `(?${ (negative) ? '!' : '=' }${ aheads.join('|') })`;
}

export function lookbehinds(behinds: readonly string[] = [], negative = false) {
	return `(?<${ (negative) ? '!' : '=' }${ behinds.join('|') })`;
}
