let break: str = "break";
let continue: str = "continue";
let _: str = "blank";
let _: str = _;
let _: _ = blank;
type _ = Blank;
type _ = _;
while continue do { break; set break = "1"; };
let x: bool = break == continue;

%%% The value of `a`. %%
let a: null | bool = +42 && null;
let b: int = 004_2. || false;
let c: float = [-42.2_4, true];
let d: str = 42.2e4_2;
let e: Object = 42.2e+4_2;
let f: %% comm %% TypeF | String = "f";

let %%var%% 'var': int =
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
set g.<U>(42)~~.y++.0.["prop" || "key"] = 42;

% unit access assignments
set """a template""".value = val;
set "a string".value       = val;
set 42.value               = val;
set null.value             = val;
set true.value             = val;
set false.value            = val;
set never.value            = val;
set void.value             = val;
set bool.value             = val;
set int.value              = val;
set float.value            = val;
set str.value              = val;
set obj.value              = val;
set unknown.value          = val;
set this.value             = val;
set super.value            = val;
set static.value           = val;
set hyper.value            = val;
set method.value           = val;
set Object.value           = val;
set Class.value            = val;
set List.value             = val;
set Dict.value             = val;
set Set.value              = val;
set Map.value              = val;
set _.value                = val;


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


type 'bōōl | floàt' = 'floàt | bōōl' | float | bool;
type SpreadTest = [T, #Spread] | [name: T, ##DoubleSpread];
type nominal SpreadTest = [T, #Spread] | [name: T, ##DoubleSpread];
type Tup = [A, ?: B];
type Rec = [a: A, B$, c?: C];
type RecDestructure = [a: A, B$, c?: C, [d, [e]]: De, [f$, g: [h$]]: Fg];
type Awaited<T> = T~~;
type SpreadTest = [
	T,
	#Spread,
] | [
	name: T,
	##DoubleSpread,
];
type T<out U> = U & V
	.<W>;
type U<in V narrows W.<int>> = V | W.<X>;
type U narrows int | bool = int;
type U<mut in V ?= W.<int>> = V | W.%%c%%<X>;
type U<V= Vv> = Vv | W;

type [A, B] = [int, float];
type [c: C, d: D] = [c: int, d: float];
type [E$, F$] = [E: int, F: float];
type [S ?= bool] = Tup;

type [G, [H, I]] = Ghi;
type [J, [K$, lima: L]] = Jkl;
type [M$, november: [N, O]] = Mno;
type [P$, quebec: [Q$, romeo: R]] = Pqr;

type Or<T= [A narrows C, B]> = A | B;
type Or<T= [a: A, B$]> = A | B;
type Or<T= [J, [K$, lima: L]]> = J | K | L;
type Or<T= [M$, november: [N, O]]> = M | N | O;
type Or<T= [S ?= bool] ?= [unknown]> = S | null;

type [A<T>, nominal B<U= V>] = [int | T, float & V];
type [C$, d: nominal D<out W narrows [unknown] ?= X>] = [C: B.<U= null>, d: W.0];
type [C$, d: D<Y= [nominal out W narrows unknown ?= Z] ?= X>] = [C: B.<U= null>, d: W];

type T = [a: boolean, b: int, c: T];
let x: T = [a= false, b= 42, c$];

let 'bōōl || flō' = 'flō || bōōl' || flo || boo;
let var w: bool | T | 'floàt | bōōl' = bool;
let var w: 3.2 = 3.2 == 3.2;
let var w: null = null;
let var w: T = T;
let tup:  mut [int] = [42];
let rec:  mut [a: int] = [a= 42];
let list: mut int[] = List.<int>([42]);
let hash: mut [:int] = Dict.<int>([a= 42]);
let set:  mut int{} = Set.<int>([42]);
let map:  mut {int -> str} = {42 -> "42.0", 43 -> "43.0"};

claim x: T;
claim x.<U>(42)~~.y++.0.["prop" || "key"]: T;

type VoidFn<Arg> = (arg: Arg) => void;
function print(message: str): void {;}
function print(message) impl VoidFn.<str> {;}
function print<T>(message) impl VoidFn.<T> {;}
function print<T narrows str>(message) impl VoidFn.<T> {;}
claim print(message: str): void;
claim print(message) impl VoidFn.<str>;
claim print<T>(message) impl VoidFn.<T>;
claim print<T narrows str>(message) impl VoidFn.<T>;
claim print: (message: str) => void;
claim print: <T narrows str>(message: T) => void;
claim print: VoidFn.<str>;

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
type Or<T, U, V> = Or.<T, U> | V | this;
typefunc Or<T, U> => T | U{};
typefunc Or<T, U, V> => Or.<T, U> | V;
public typefunc Map<T, U> => {T -> U};
secret typefunc Mapping<in T, out U> => {T -> U};
private typefunc Or<
	mut in out T,
	in mut out U,
	mut in mut out V,
	in out W,
> => Or.<T, U> | [:V & W];


% variable destructuring:
let [x, y]: int          = [1, 2];
let [x: int, y: int]     = [1, 2];
let [if$, by= b]: int    = [if= 1, by= 2];
let [x$: int, y= b: int] = [x= 1, y= 2];
let [[var x], [y= [b]]]: int = [[1], [y= [2]]];

% variable destructuring with defaults:
let [a:    SomeType.0 ?= x, b:    SomeType.1 ?= y, c:    SomeType.2 ?= z]           = some_object;
let [a                ?= x, b                ?= y, c                ?= z]: SomeType = some_object;
let [a= x: SomeType.a ?= t, b= y: SomeType.b ?= u, c= z: SomeType.c ?= v] = some_object;
let [a= x,                  b= y,                  c= z]: SomeType        = some_object;

% function parameter destructuring with defaults:
function f(arg= [a:    SomeType.0 ?= x, b:    SomeType.1 ?= y, c:    SomeType.2 ?= z]) => some_object;
function f(arg= [a= x: SomeType.a ?= t, b= y: SomeType.b ?= u, c= z: SomeType.c ?= v]) => some_object;

% claim destructuring:
claim [a]:                [int];
claim [x, y]:             int[2];
claim [if$, by= b]:       [if: If, by: B];
claim [[x], [y= [b]]]:    [[X], [y: [B]]];
claim [x.1, y.2]:         int[2];
claim [x.i, y.j]:         int[2];
claim [x.[i + j], y.[j]]: int[2];
claim [if$, by= b.j]:     [if: If, by: Bj];
claim [[x$], [y= [b.j]]]: [[X], [y: [Bj]]];

% not claim destructuring:
claim (a).c:                  int;
claim (a.b).c:                int;
claim (a || b).c:             int;
claim (<[y: int]>x).y:        int;
claim [a].c:                  TupleValue;
claim [a.b].c:                TupleValue;
claim [a || b].c:             TupleValue;
claim [<[y: int]>x].y:        TupleValue;
claim [prop= a].c:            RecordValue;
claim [prop= a.b].c:          RecordValue;
claim [prop= a || b].c:       RecordValue;
claim [prop= <[y: int]>x].y:  RecordValue;
claim {a}.c:                  SetValue;
claim {a.b}.c:                SetValue;
claim {a || b}.c:             SetValue;
claim {<[y: int]>x}.y:        SetValue;
claim {kie -> a}.c:           MapValue;
claim {kie -> a.b}.c:         MapValue;
claim {kie -> a || b}.c:      MapValue;
claim {kie -> <[y: int]>x}.y: MapValue;


% reassignment destructuring:
set [a]                = [1];
set [x, y] %%c%%       = [1, 2];
set [x.1, y.2]         = [1, 2];
set [x.i, y.j]         = [1, 2];
set [x.[i + j], y.[j]] = [1, 2];
set [if$, by= b.j]     = [if= 1, by= 2];
set [[x$], [y= [b.j]]] = [[x= 1], [y= [2]]];

% not reassignment destructuring:
set (a).c                  = value;
set (a.b).c                = value;
set (a || b).c             = value;
set (<[y: int]>x).y        = value;
set [a].c                  = tupleValue;
set [a.b].c                = tupleValue;
set [a || b].c             = tupleValue;
set [<[y: int]>x].y        = tupleValue;
set [prop= a].c            = recordValue;
set [prop= a.b].c          = recordValue;
set [prop= a || b].c       = recordValue;
set [prop= <[y: int]>x].y  = recordValue;
set {a}.c                  = setValue;
set {a.b}.c                = setValue;
set {a || b}.c             = setValue;
set {<[y: int]>x}.y        = setValue;
set {kie -> a}.c           = mapValue;
set {kie -> a.b}.c         = mapValue;
set {kie -> a || b}.c      = mapValue;
set {kie -> <[y: int]>x}.y = mapValue;
