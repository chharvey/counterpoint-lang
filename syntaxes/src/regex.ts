/** `x` → `(x)` */
export function g(x: string): string {
	return `(${ x })`;
}

/** `x` → `(?:x)` */
function u(x: string): string {
	return `(?:${ x })`;
}

/** `x` → `\b(?:x)\b` */
export function w(x: string): string {
	return s('\\b', u(x), '\\b');
}

/** `x` → `(?:x)?` */
export function o(x: string): string {
	return u(x).concat('?');
}

/** `x` → `(?:x)*` */
export function r0(x: string): string {
	return u(x).concat('*');
}

/** `x` → `(?:x)+` */
export function r1(x: string): string {
	return u(x).concat('+');
}

/** `x, y` → `(?:x)(?:y)` */
export function s(...xx: readonly string[]): string {
	return xx.map((x) => u(x)).join('');
}

/** `x, y` → `(?:x)|(?:y)` */
export function c(...xx: readonly string[]): string {
	return xx.map((x) => u(x)).join('|');
}
