let break: str = 'break';
let continue: str = 'continue';
while continue do { break; set break = '1'; };
let x: bool = break == continue;

%%% The value of `a`. %%
let a: null | bool = +42 && null;
let b: int = 004_2. || false;
let c: float = [-42.2_4, true];
let d: str = 42.2e4_2;
let e: obj = 42.2e+4_2;
let f: %% comm %% TypeF | String = 'f';

let %%unfixed%% `unfixed`: int =
	  -\b1379fz
	+ -\q1379fz
	+ -\o1379fz
	+ -\d1379fz
	+ -\x1379fz
	+ -\z1379fz
;
set %%c%% g = 42;
set g = 42 == 42;
set g == 42;
set g = if true then 1 else 0;
set g = if true then {1,} else {0,};
set g.<U>(42)~~.y++.0.['prop' || 'key'] = 42;
set this.g = 42;
set super.g = 42;
set static.g = 42;
set hyper.g = 42;

let h: int = if true then 1 else 0;

% augmentation:
set a ^= b;
set a *= b;
set a /= b;
set a += b;
set a -= b;
set a &&= b;
set a !&= b;
set a ||= b;


type `floàt | bōōl` = `floàt | bōōl` | float | bool;
type SpreadTest = [T, #Spread] | [name: T, ##DoubleSpread];
type nominal SpreadTest = [T, #Spread] | [name: T, ##DoubleSpread];
type SpreadTest = [
	T,
	#Spread,
] | [
	name: T,
	##DoubleSpread,
];
type T<U> = U & V
	.<W>;
type U<V narrows W.<int>> = V | W.<X>;
type U<V = W.<int>> = V | W.%%c%%<X>;

type T = [a: boolean, b: int, c: T];
let x: T = [a= false, b= 42, c$];

let `flō || bōōl` = `flō || bōōl` || flo || boo;
let unfixed w: bool | T | `floàt | bōōl` = bool;
let unfixed w: 3.2 = 3.2 == 3.2;
let unfixed w: null = null;
let unfixed w: T = T;
let tup: mutable [int] = [42];
let rec: mutable [a: int] = [a= 42];
let list: mutable int[] = List.<int>([42]);
let hash: mutable [:int] = Dict.<int>([a= 42]);
let set: mutable int{} = Set.<int>([42]);
let map: mutable {int -> str} = {42 -> '42.0', 43 -> '43.0'};

claim x: T;
claim x.<U>(42)~~.y++.0.['prop' || 'key']: T;

public let x: float = 0.0;
secret let x: float = 0.0;
private let y: float = 0.0;
public type X = float | int;
secret type X = float | int;
private type Y = float | int;
public type A<T> = float | T;
secret type A<T> = float | T;
private type B<T> = float | T;

type Or<T, U> = T | U;
type Or<T, U, V> = Or.<T, U> | V;
typefunc Or<T, U> => T | U{};
typefunc Or<T, U, V> => Or.<T, U> | V;
public typefunc Map<T, U> => {T -> U};
secret typefunc Mapping<T, U> => {T -> U};
private typefunc Or<T, U, V> => Or.<T, U> | [:V];


% variable destructuring:
let (x, y): int            = [1, 2];
let (x: int, y: int)       = [1, 2];
let (if$, by as b): int    = [if= 1, by= 2];
let (x$: int, y as b: int) = [x= 1, y= 2];
let ((unfixed x), (y as (b))): int = [[1], [y= [2]]];

% claim destructuring:
claim (x, y): int;
claim (x: int, y: int);
claim (if$, by as b): int;
claim (x$: int, y as b: int);
claim ((x), (y as (b))): int;
claim (x.1, y.2): T;
claim (x.i, y.j): T;
claim (x.[i + j], y.[j]): T;
claim (if$, by as b.j): T;
claim ((x$), (y as (b.j))): T;

% reassignment destructuring:
set (x, y) %%c%%         = [1, 2];
set (x.1, y.2)           = [1, 2];
set (x.i, y.j)           = [1, 2];
set (x.[i + j], y.[j])   = [1, 2];
set (if$, by as b.j)     = [if= 1, by= 2];
set ((x$), (y as (b.j))) = [[x= 1], [y= [2]]];
