%-- type declarations, function types --%
type BinaryOperator = <N narrows int>(a: N, b?: N) => N;
type BinaryOperator = <out N>(a: N, b?: N) => N;
type BinaryOperator = <in N>(a: N, b?: N) => N;
type BinaryOperator = (a: N, b?: N) => N | M;
type BinaryOperatorUnnamed = (T & U, ?: int | Object~~, ?: bool) => (float) => int;
type BinaryOperatorUnnamed = (?: int | Object, ?: [T, U], ?: (bool!) => void) => float;
type BinaryOperator = <
	N narrows int~~,
>(
	'a': N,
	b?:  N,
	c%%c%%: N,
) %%c%% => N;
type BinaryOperator = (
	'a': N,
	b?:  N,
	c%%c%%: N,
) %%c%% => N;
type Const = () => int;
type Const = (
) => int;
type ReturnsTemplateType = () => """a {{ string }} template type""";
let x: <out T widens U~~, in U ?= Set.<null>>(a: Set.<T>~~, b: Set.<U~~>) => bool = null;


%-- function expression statements --%
(var h: int): int => h + 1;
(%%var%% h: int): int => h + 1;
% return type with set/map shorthand syntax
(): (int{}) {
	return {42, 69};
};
(): (int{}) => {42, 69};
(): ({int -> int}) {
	return {42 -> 69};
};
(): ({int -> int}) => {42 -> 69};



%-- variable declarations, function expressions --%
let x: (a: str) => str = (a: str): str => """<x>{{ a }}</x>""";
let x: (a: str) => str = (a: str): str {
	function y(): void {;}
	let x: str = "x";
	return """<{{ x }}>{{ a }}</{{ x }}>""";
};
% return type with set/map shorthand syntax
let return_set_of_int = (): (int{}) {
	return {42, 69};
};
let return_set_of_int = (): (int{}) => {42, 69};
let return_map_of_int = (): ({int -> int}) {
	return {42 -> 69};
};
let return_map_of_int = (): ({int -> int}) => {42 -> 69};
let lambda: Function = (            )      { return a * 2; };
let lambda: Function = (a           )      { return a * 2; };
let lambda: Function = (a: int      ): int { return a * 2; };
let lambda: Function = (a      ?= 42): int { return a * 2; };
let lambda: Function = (a: int ?= 42): int { return a * 2; };
let lambda: Function = (            )      => a * 2;
let lambda: Function = (a           )      => a * 2;
let lambda: Function = (a: int      ): int => a * 2;
let lambda: Function = (a      ?= 42): int => a * 2;
let lambda: Function = (a: int ?= 42): int => a * 2;
let lambda: Function = <T               >() {};
let lambda: Function = <out T           >() {};
let lambda: Function = <in  T           >() {};
let lambda: Function = <T narrows U     >() {};
let lambda: Function = <T           ?= V>() {};
let lambda: Function = <T narrows U ?= V>() {};
let not_lambda: NotFunction = a < b > (c);
let not_lambda: NotFunction = a.<b>(c);

let lambda: Function = (
	a,
	a: int,
	a      ?= 42,
	a: int ?= 42,
	var b,
) { return a * 2; };
let lambda: Function = (
	a,
	a: int,
	a      ?= 42,
	a: int ?= 42,
	var b,
) => a * 2;
let lambda: Function = <
	T,
	out T,
	in  T,
	mut out T,
	mut in  T,
	T narrows U,
	T ?= V,
	T narrows U ?= V,
>() {};

let nestedfunctions: (a: (x: int) %%c%% => %%c%% int) %%c%% => %%c%% bool
	= (a: (x: int) %%c%% => %%c%% int ?= (x) %%c%% => %%c%% x * 2) %%c%% => %%c%% !!a;

let lambdawithblockcomments: Function = <T, U>%%hello%%(a: T, b: U): Object %%world%% => a || b;
let lambdawithblockcomments: Function = <T, U>%%hello%%(a: T, b: U) %%world%% => a || b;
let lambdawithlinecomments: Function = <T, U> % hello
	(a: T, b: U): Object % world
	=> a || b;
let lambdawithlinecomments: Function = <T, U> % hello
	(a: T, b: U) % world
	=> a || b;

let lambdaWithCaptures: Function = [a, b ,](x) => a + b + x;
let lambdaWithCaptures: Function = <T>[a, b ,](x) => a + b + x;
let lambdaWithCaptures: Function = <T, U>[a, b ,](x) => a + b + x;
let lambdaWithGeneric:  Function = <T>(x) => a + b + x;
let lambdaWithCaptures: Function = [
	a,
	'b',
](x) => a + b + x;
let tuple: [Function] = [[a, ref b](x) => a + b + x];
let record: [lambdaWithCaptures: Function] = [lambdaWithCaptures= [a, ref b](x) => a + b + x];



%-- function declarations --%
function 'func'(param: annot ?= initial): void {;}
function _(): void {;}
function <_, B>(): B {;}
function (_: A, b: B): B {;}

function add(a: int ?= 0, b: int ?= 0): int { return a + b; }
function subtract(var a: int ?= 0, %%var%% b: int ?= a): int => a - b;
function %%comm%% do_nothing(): void {
	let x: anything = 0;
	return;
}
function error(): nothing {
	throw if true then "error" else "an error";
	throw (if true then "error" else "an error");
}
function parameterAlias(p %%c%% = %%c%% q: anything): null => null;
function parameterNoAlias(q: anything): null => null;

function append<T widens bool>(arr: Array.<T> ?= [], it: T): void {
	arr.push.<T>(it)~;
}
function derivative<T narrows float>(lambda: (y: T) => T, delta: T): ((x: T) => T) {
	return (x: T): T => (lambda.(x + delta)~ - lambda.(x)~) / delta;
}
function subset<T ?= Set.<null>, U widens T>(a: Set.<T>, b: Set.<U>): bool {;}

function functionWithCaptures[a, ref b](x: int): int => a + b + x;
function functionWithCaptures[
	a,
	ref 'b',
](x: int): int => a + b + x;

function returnFunc(): Object => (x: int): int => x + 1;
function returnFunc(): (Object) => (x: int): int => x + 1;
function returnFunc(): Object{} => (x: int): int => x + 1;
function returnFunc(): Object => (x: int): (int{}) => x + 1;
function returnFunc(): ((x: int) => int) => (x) => x + 1;

function returnFunc(): ((A) => (B)) => (a) => b;
function returnInstance(): interface {
	x: int;
	y(): int;
	z(): (str) => int;
} => (class {
	public x: int = 0;
	public y(): int => 0;
	public y(): (int) => 0;
	public z(): ((str) => int) => (s: str) => str.length;
}).();
% return type with set/map shorthand syntax
function return_set_of_int(): (int{}) {
	return {42, 69};
};
function return_set_of_int(): (int{}) => {42, 69};
function return_map_of_int(): ({int -> int}) {
	return {42 -> 69};
};
function return_map_of_int(): ({int -> int}) => {42 -> 69};

function add<T>(x, y) impl BinaryOperator.<T> {
	return x + y;
}
function add<T>(x, y) impl BinaryOperator.<T> => x + y;
function addCaptures<T>[z](x, y) impl BinaryOperator.<T> {
	return x + y + z;
}
function addCaptures<T>[z](x, y) impl BinaryOperator.<T> => x + y + z;

public function subtract(a: N, b: N): N { return a - b; }
internal function subtract(a: N, b: N): N => a - b;
private function subtract(a: N, b: N): N => a - b;
