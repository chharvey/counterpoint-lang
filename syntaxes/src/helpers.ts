import * as R from './regex.ts';


export function pattern_name(name: string) {
	return name.concat('.cpl');
}

export function digits(charclass: string, base = '') {
	return R.s(base ? R.g(`\\\\${ base }`) : '', R.r0(R.s(charclass, R.o('_'))), charclass);
}

export function lookaheads(aheads: readonly string[] = [], negative = false) {
	return `(?${ negative ? '!' : '=' }${ R.c(...aheads) })`;
}

export function lookbehinds(behinds: readonly string[] = [], negative = false) {
	return `(?<${ negative ? '!' : '=' }${ R.c(...behinds) })`;
}


export {R};
