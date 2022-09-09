%-- type declarations, function types --%
type BinaryOperator = fn <N narrows int>(a: N, b?: N) => N;
type BinaryOperator = fn (a: N, b?: N) => N | M;
type BinaryOperatorUnnamed = fn (T & U, ?: int | Object, ?: bool) => fn (float) => int;
type BinaryOperatorUnnamed = fn (?: int | Object, ?: [T, U], ?: fn (bool!) => void) => float;
type BinaryOperator = fn <
	N narrows int,
>(
	`a`: N,
	b?:  N,
	c%%c%%: N,
) %%c%% => N;
type BinaryOperator = fn (
	`a`: N,
	b?:  N,
	c%%c%%: N,
) %%c%% => N;
type Const = fn () => int;
type Const = fn (
) => int;
type ReturnsTemplateType = fn () => '''a {{ string }} template type''';
let x: fn <T widens U, U = Set.<null>>(a: Set.<T>, b: Set.<U>) => bool = null;

type AsyncFuncType    = async     (p: int, q: rat) => float;
type GenFuncType      = gen       (p: int, q: rat) => float;
type AsyncGenFuncType = async gen (p: int, q: rat) => float;
type AsyncFuncType    = async     (int | rat) => float;
type GenFuncType      = gen       (int | rat) => float;
type AsyncGenFuncType = async gen (int | rat) => float;


%-- function expression statements --%
fn (unfixed h: int): int => h + 1;
fn (%%unfixed%% h: int): int => h + 1;
async (p: int, q: rat): float => p~~ * q~~;



%-- variable declarations, function expressions --%
let x: fn (a: str) => str = fn (a: str): str => '''<x>{{ a }}</x>''';
let x: fn (a: str) => str = fn (a: str): str {
	func y(): void {;}
	let x: str = 'x';
	return '''<{{ x }}>{{ a }}</{{ x }}>''';
};
let lambda: Function = fn (           )      { return a * 2; };
let lambda: Function = fn (a          )      { return a * 2; };
let lambda: Function = fn (a: int     ): int { return a * 2; };
let lambda: Function = fn (a      = 42): int { return a * 2; };
let lambda: Function = fn (a: int = 42): int { return a * 2; };
let lambda: Function = fn (           )      => a * 2;
let lambda: Function = fn (a          )      => a * 2;
let lambda: Function = fn (a: int     ): int => a * 2;
let lambda: Function = fn (a      = 42): int => a * 2;
let lambda: Function = fn (a: int = 42): int => a * 2;
let lambda: Function = fn <T              >() {};
let lambda: Function = fn <T narrows U    >() {};
let lambda: Function = fn <T           = V>() {};
let lambda: Function = fn <T narrows U = V>() {};
let not_lambda: NotFunction = a < b > (c);
let not_lambda: NotFunction = a.<b>(c);
let async_lambda: AsyncFunction = async (p: int, q: rat): float => p~~ * q~~;
let gen_lambda: GenFunction = gen (p: int, q: rat): float { yield p * q; };
let async_gen_lambda: AsyncGenFunction = async gen (p: int, q: rat): float { yield p~~ * q~~; };

let lambda: Function = fn (
	a,
	a: int,
	a      = 42,
	a: int = 42,
	unfixed b,
) { return a * 2; };
let lambda: Function = fn (
	a,
	a: int,
	a      = 42,
	a: int = 42,
	unfixed b,
) => a * 2;
let lambda: Function = fn <
	T,
	T narrows U,
	T = V,
	T narrows U = V,
>() {};

let nestedfunctions: fn (a: fn (x: int) %%c%% => %%c%% int) %%c%% => %%c%% bool
	= fn (a: fn (x: int) %%c%% => %%c%% int = fn (x) %%c%% => %%c%% x * 2) %%c%% => %%c%% !!a;

let lambdawithblockcomments: Function = fn <T, U>%%hello%%(a: T, b: U): obj %%world%% => a || b;
let lambdawithblockcomments: Function = fn <T, U>%%hello%%(a: T, b: U) %%world%% => a || b;
let lambdawithlinecomments: Function = fn <T, U> % hello
	(a: T, b: U): obj % world
	=> a || b;
let lambdawithlinecomments: Function = fn <T, U> % hello
	(a: T, b: U) % world
	=> a || b;

let lambdaWithCaptures: Function = fn [a, b ,](x) => a + b + x;
let lambdaWithCaptures: Function = fn <T>[a, b ,](x) => a + b + x;
let lambdaWithCaptures: Function = fn <T, U>[a, b ,](x) => a + b + x;
let lambdaWithGeneric:  Function = fn <T>(x) => a + b + x;
let lambdaWithCaptures: Function = fn [
	a,
	`b`,
](x) => a + b + x;
let tuple: [Function] = [fn [a, b](x) => a + b + x];
let record: [lambdaWithCaptures: Function] = [lambdaWithCaptures= fn [a, b](x) => a + b + x];



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
func derivative<T narrows float>(lambda: fn (y: T) => T, delta: T): fn (x: T) => T {
	return fn (x: T): T => (lambda.(x + delta)~ - lambda.(x)~) / delta;
}
func subset<T = Set.<null>, U widens T>(a: Set.<T>, b: Set.<U>): bool {;}

func functionWithCaptures[a, b](x: int): int => a + b + x;
func functionWithCaptures[
	a,
	`b`,
](x: int): int => a + b + x;

func returnFunc(): obj                => fn (x: int): int   => x + 1;
func returnFunc(): obj{}              => fn (x: int): int   => x + 1;
func returnFunc(): obj                => fn (x: int): int{} => x + 1;
func returnFunc(): fn (x: int) => int => fn (x) => x + 1;

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
