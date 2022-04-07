%-- type declarations, function types --%
type BinaryOperator = <N narrows int>(a: N, b?: N) => N;
type BinaryOperator = (a: N, b?: N) => N | M;
type BinaryOperatorUnnamed = (T & U, ?: int | Object, ?: bool) => (float) => int;
type BinaryOperatorUnnamed = (?: int | Object, ?: [T, U], ?: (bool!) => void) => float;
type BinaryOperator = <
	N narrows int,
>(
	`a`: N,
	b?:  N,
	c%%c%%: N,
) %%c%% => N;
type BinaryOperator = (
	`a`: N,
	b?:  N,
	c%%c%%: N,
) %%c%% => N;
type Const = () => int;
type Const = (
) => int;
type ReturnsTemplateType = () => '''a {{ string }} template type''';
let x: <T widens U, U = Set.<null>>(a: Set.<T>, b: Set.<U>) => bool = null;

type AsyncFuncType = async (p: int, q: rat) => float;
type GenFuncType = gen (p: int, q: rat) => float;
type AsyncGenFuncType = async gen (p: int, q: rat) => float;


%-- function expression statements --%
(unfixed h: int): int => h + 1;
(%%unfixed%% h: int): int => h + 1;
async (p: int, q: rat): float => p~~ * q~~;



%-- variable declarations, function expressions --%
let x: (a: str) => str = (a: str): str => '''<x>{{ a }}</x>''';
let x: (a: str) => str = (a: str): str {
	func y(): void {;}
	let x: str = 'x';
	return '''<{{ x }}>{{ a }}</{{ x }}>''';
};
let lambda: Function = (           )      { return a * 2; };
let lambda: Function = (a          )      { return a * 2; };
let lambda: Function = (a: int     ): int { return a * 2; };
let lambda: Function = (a      = 42): int { return a * 2; };
let lambda: Function = (a: int = 42): int { return a * 2; };
let lambda: Function = (           )      => a * 2;
let lambda: Function = (a          )      => a * 2;
let lambda: Function = (a: int     ): int => a * 2;
let lambda: Function = (a      = 42): int => a * 2;
let lambda: Function = (a: int = 42): int => a * 2;
let lambda: Function = <T              >() {};
let lambda: Function = <T narrows U    >() {};
let lambda: Function = <T           = V>() {};
let lambda: Function = <T narrows U = V>() {};
let not_lambda: NotFunction = a < b > (c);
let not_lambda: NotFunction = a.<b>(c);
let async_lambda: AsyncFunction = async (p: int, q: rat): float => p~~ * q~~;
let gen_lambda: GenFunction = gen (p: int, q: rat): float { yield p * q; };
let async_gen_lambda: AsyncGenFunction = async gen (p: int, q: rat): float { yield p~~ * q~~; };

let lambda: Function = (
	a,
	a: int,
	a      = 42,
	a: int = 42,
	unfixed b,
) { return a * 2; };
let lambda: Function = (
	a,
	a: int,
	a      = 42,
	a: int = 42,
	unfixed b,
) => a * 2;
let lambda: Function = <
	T,
	T narrows U,
	T = V,
	T narrows U = V,
>() {};

let nestedfunctions: (a: (x: int) %%c%% => %%c%% int) %%c%% => %%c%% bool
	= (a: (x: int) %%c%% => %%c%% int = (x) %%c%% => %%c%% x * 2) %%c%% => %%c%% !!a;

let lambdawithblockcomments: Function = <T, U>%%hello%%(a: T, b: U): obj %%world%% => a || b;
let lambdawithblockcomments: Function = <T, U>%%hello%%(a: T, b: U) %%world%% => a || b;
let lambdawithlinecomments: Function = <T, U> % hello
	(a: T, b: U): obj % world
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
	`b`,
](x) => a + b + x;
let tuple: [Function] = [[a, b](x) => a + b + x];
let record: [lambdaWithCaptures: Function] = [lambdaWithCaptures= [a, b](x) => a + b + x];



%-- function declarations --%
func `func`(param: annot = initial): void {;}
func add(a: int = 0, b: int = 0): int { return a + b; }
func subtract(unfixed a: int = 0, %%unfixed%% b: int = a): int => a - b;
func %%comm%% nothing(): void {
	let x: unknown = 0;
	return;
}
func error(): never {
	throw if true then 'error' else 'an error';
	throw (if true then 'error' else 'an error');
}
func parameterAlias(p %%c%% as %%c%% q: unknown): null => null;
func parameterNoAlias(q: unknown): null => null;

func append<T widens bool>(arr: Array.<T> = [], it: T): void {
	arr.push.<T>(it)~;
}
func derivative<T narrows float>(lambda: (y: T) => T, delta: T): (x: T) => T {
	return (x: T): T => (lambda.(x + delta)~ - lambda.(x)~) / delta;
}
func subset<T = Set.<null>, U widens T>(a: Set.<T>, b: Set.<U>): bool {;}

func functionWithCaptures[a, b](x: int): int => a + b + x;
func functionWithCaptures[
	a,
	`b`,
](x: int): int => a + b + x;

func returnFunc(): obj => (x: int): int => x + 1;
func returnFunc(): obj{} => (x: int): int => x + 1;
func returnFunc(): obj => (x: int): int{} => x + 1;
func returnFunc(): (x: int) => int => (x) => x + 1;

func add<T> implements BinaryOperator.<T> (x: T, y: T): T {
	return x + y;
}
func add<T> implements BinaryOperator.<T> (x: T, y: T): T => x + y;
func addCaptures<T> implements BinaryOperator.<T> [z](x: T, y: T): T {
	return x + y + z;
}
func addCaptures<T> implements BinaryOperator.<T> [z](x: T, y: T): T => x + y + z;

public func subtract(a: N, b: N): N { return a - b; }
secret func subtract(a: N, b: N): N => a - b;
private func subtract(a: N, b: N): N => a - b;

func async asyncFunc(p: int, q: rat): float => p~~ * q~~;
func async asyncFunc(p: int, q: rat): float { return p~~ * q~~; }
func gen genFunc(p: int, q: rat): float { yield # p * q; }
func async gen asyncGenFunc(p: int, q: rat): float { yield p~~ * q~~; }
