if 'hello' /* world */ %% then %% then
true else % false
(if !true
	then false
	% a line comment
	else true
);
if a then b else c;
(if a then b else c);

if true then {
	return false;
} else if false then {
	return true;
} else %%comm%% if null then {
	return null;
} else {
	return;
};
if if a then b else c then {
	if a then b else c;
} else if (if a then b else c) then {
	return (if a then b else c);
} else {
	while if a then b else c do { d; };
};

while %% this is a
block comment
%% +it +ends +here do {
	while false do {
		if false then '''{{ 0 }} 0''' else '''{{ 1 }} 1''';
		(if false then '''{{ 0 }} 0''' else '''{{ 1 }} 1''');
		break 1;
		continue;
	};
	if true then {
		if false then '''{{ 0 }} 0''' else '''{{ 1 }} 1''';
	} else %% comment %% {
		(if false then '''{{ 0 }} 0''' else '''{{ 1 }} 1''');
	};
};
unless false then {
	'''{{ 0 }} 0''';
} else {
	'''{{ 1 }} 1''';
};
until false do {
	true;
};
do {
	true;
} until false;

for %% int %% i from %% start %% 1 to %% end %% 10 by %% increment %% 2 do {
	do {
		if false then '''{{ 0 }} 0''' else '''{{ 1 }} 1''';
		(if false then '''{{ 0 }} 0''' else '''{{ 1 }} 1''');
		break 1;
		continue;
	} while false;
	for x from if a then b else c to if a then b else c by if a then b else c do {
		do { d; } while if a then b else c;
	};
};

let break: str = 'break';
let continue: str = 'continue';
while continue do { break; break = '1'; };
let x: bool = break == continue;

%%
	hello
	%% 'nesting' isnt allowed %%
	world
%%;

	%%%
	The thing that does something.
	@takes x the parameter
	@returns what it returns
	@throws if something bad happened
	%%
func twice(x: int): int => x * 2;

{
	% operators:
	!a;
	?a;
	+x;
	-y;
	+42;
	-42;
	a + b;
	a - b;
	a ^ b;
	a * b;
	a / b;
	x < y;
	x > y;
	x <= y;
	x >= y;
	x !< y;
	x !> y;
	x == y;
	x != y;
	x is y;
	x isnt y;
	x && y;
	x || y;
	x !& y;
	x !| y;
	type X = T & S;
	type X = T | S;
	type X = T!;
	type X = T?;
	[a, [b, b], (c + c), #spread];
	[a= 3, c= 5, key= value, punn$, ##doublespread];
	[+a |-> -b, ];
	[+3 |-> -5, ];
	if true then 1 else 0;
	null || (if true then 1 else 0);
	array && [key$];
	array.[index];
	array.%%dot%%[index];
	funkshin. (call / a, #spread + b, 3, label %% args %% = c, punn$, ##doublespread)~;
	funkshin.<T>%%c%%(call / a, #spread + b, 3, label %% args %% = c, punn$, ##doublespread)~;
	funkshin.%%c%%(
		call / a,
		#spread + b,
		3,
		label %% args %% = c,
		punn$,
		##doublespread,
		(a,)=   [4, 2],
		(a ,)=  [4, 2],
		(a,) => [4, 2],
	)~;
	structure.property + p;
	structure.`pr op` + p;
	structure.%%dot%%property + p;
	structure.%%dot%%`pr op` + p;
	array.3 + p;
	array.%%dot%%3 + p;
	array.-1 + p;
	array.+1 + p;
	array.-\b1 + p;
	array.+\b1 + p;
	awaiting~;
}


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
g = 42;
g = 42 == 42;
g == 42;
g = if true then 1 else 0;
g = if true then {1;} else {0;};
let h: int = if true then 1 else 0;
(unfixed h: int): int => h + 1;
(%%unfixed%% h: int): int => h + 1;

(x);
(a == b);
[a == b];
((h: int = 0): int => h + 1);
[(h: int = 0): int => h + 1];
[fun= (h: int): int => h + 1];
type T = [fun: (a: int) -> {int}];

type `floàt | bōōl` = `floàt | bōōl` | float | bool;
type SpreadTest = [T, #Spread] | [name: T, ##DoubleSpread];
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
type BinaryOperator = <N narrows int>(a: N, b?: N) -> {N};
type BinaryOperator = (a: N, b?: N) -> {N};
type BinaryOperator = <
	N narrows int,
>(
	`a`: N,
	b?:  N,
	c%%c%%: N,
) %%c%% -> {N};
type BinaryOperator = (
	`a`: N,
	b?:  N,
	c%%c%%: N,
) %%c%% -> {N};
type Const = () -> {int};
type Const = (
) -> {int};
type ReturnsTemplateType = () -> {'''a {{ string }} template type'''};

type T = [a: boolean, b: int, c: T];
let x: T = [a= false, b= 42, c$];

let `flō || bōōl` = `flō || bōōl` || flo || boo;
let unfixed w: bool | T | `floàt | bōōl` = bool;
let unfixed w: 3.2 = 3.2 == 3.2;
let unfixed w: null = null;
let unfixed w: T = T;
let arr: mutable [int] = [42];
let rec: mutable [a: int] = [a= 42];
let map: mutable obj = [42 |-> '42.0'];


'a string that
contains a % comment
and then a new line
';

'a string that
contains a % comment but no new line';

'a string that
contains %% a
comment %% and an end comment.';

'a string that
contains %% a
comment but no end comment.';


'a string \' that escapes
a quote \\ and a backslash.';
'more escapes:
\s space
\t tab
\n newline
\r carriage-return
\\ slash
\' quote
\% percent';
'a \u{bada55}string. a \u{ bada55}string. a \u{bada55 }string. a \u{badass }string.';
'a \U{bada55}string. a \U{ bada55}string. a \U{bada55 }string. a \U{badass }string.';
'\u can be \used without brackets anywhere\u';
'a string \% escaping a percent and \{some brackets\}.';
'line continuations\
replace newlines with spaces.';

'''an interpolated {{ var / %% a comm %% +42.3 }} string''';
'''an interpolated {{ var + % a comm
-42.3 }} string''';

'''no escapes:
\s \t \n \r \\ \' \% \ \u{20}
\{\{ var \}\}
{{ '\{\{ var \}\}' }}
\{\{ {{ var }} \}\}
{{ '\{\{' }}{{ var }}{{ '\}\}' }}
''';

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
func derivative<T narrows float>(lambda: (y: T) -> {T}, delta: T): (x: T) -> {T} {
	return (x: T): T => (lambda.(x + delta)~ - lambda.(x)~) / delta;
}
func subset<T = Set.<null>, U widens T>(a: Set.<T>, b: Set.<U>): bool {;}

let x: (a: str) -> {str} = (a: str): str => '''<x>{{ a }}</x>''';
let x: (a: str) -> {str} = (a: str): str {
	func y(): void {;}
	let x: str = 'x';
	return '''<{{ x }}>{{ a }}</{{ x }}>''';
};
let x: <T widens U, U = Set.<null>>(a: Set.<T>, b: Set.<U>) -> {bool} = null;
let nestedfunctions: (a: (x: int) %%c%% -> %%c%% {int}) %%c%% -> %%c%% {bool} = (a: (x: int) %%c%% -> %%c%% {int} = (x) %%c%% => %%c%% x * 2) %%c%% => %%c%% !!a;

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

let lambda: Function = (
	a,
	a: int,
	a      = 42,
	a: int = 42,
) { return a * 2; };
let lambda: Function = (
	a,
	a: int,
	a      = 42,
	a: int = 42,
) => a * 2;
let lambda: Function = <
	T,
	T narrows U,
	T = V,
	T narrows U = V,
>() {};

let lambdawithblockcomments: Function = <T, U>%%hello%%(a: T, b: U): obj %%world%% => a || b;
let lambdawithblockcomments: Function = <T, U>%%hello%%(a: T, b: U) %%world%% => a || b;
let lambdawithlinecomments: Function = <T, U> % hello
	(a: T, b: U): obj % world
	=> a || b;
let lambdawithlinecomments: Function = <T, U> % hello
	(a: T, b: U) % world
	=> a || b;

let lambdaWithCaptures: Function = [a, b ,](x) => a + b + x;
let lambdaWithCaptures: Function = [
	a,
	`b`,
](x) => a + b + x;
let tuple: [Function] = [[a, b](x) => a + b + x];
let record: [lambdaWithCaptures: Function] = [lambdaWithCaptures= [a, b](x) => a + b + x];
func functionWithCaptures[a, b](x: int): int => a + b + x;
func functionWithCaptures[
	a,
	`b`,
](x: int): int => a + b + x;

func returnFunc(): obj => (x: int): int => x + 1;
func returnFunc(): {obj} => (x: int): int => x + 1;
func returnFunc(): (x: int) -> {int} => (x) => x + 1;


% variable destructuring:
let (x, y): int            = [1, 2];
let (x: int, y: int)       = [1, 2];
let (if$, by as b): int    = [if= 1, by= 2];
let (x$: int, y as b: int) = [x= 1, y= 2];
let ((unfixed x), (y as (b))): int = [[1], [y= [2]]];

% function parameter destructuring:
func f(param as (x, y): int            = [1, 2]):       int => x + y;
func f(param as (x: int, y: int)       = [1, 2]):       int => x + y;
func f(until as (if$, by as b): int  = [if= 1, by= 2]): int => if + b;
func f(param as (x$: int, y as b: int) = [x= 1, y= 2]): int => x + b;
func f(param as ((unfixed x), (y as (b))): int = [[1], [y= [2]]]): int => x + b;
let f: obj = (param as (x, y): int            = [1, 2]):       int => x + y;
let f: obj = (param as (x: int, y: int)       = [1, 2]):       int => x + y;
let f: obj = (until as (if$, by as b): int  = [if= 1, by= 2]): int => if + b;
let f: obj = (param as (x$: int, y as b: int) = [x= 1, y= 2]): int => x + b;
let f: obj = (param as ((unfixed x), (y as (b))): int = [[1], [y= [2]]]): int => x + b;
let f: obj = (param as (x, y): int            = [1, 2]):       int { return x + y; };
let f: obj = (param as (x: int, y: int)       = [1, 2]):       int { return x + y; };
let f: obj = (until as (if$, by as b): int  = [if= 1, by= 2]): int { return if + b; };
let f: obj = (param as (x$: int, y as b: int) = [x= 1, y= 2]): int { return x + b; };
let f: obj = (param as ((unfixed x), (y as (b))): int = [[1], [y= [2]]]): int { return x + b; };

% record property destructuring:
[(x, y)=       [1, 2]];
[(if$, by as b)= [if= 1, by= 2]];
[((x$), (y as (b)))= [[x= 1], [y= [2]]]];
% not destructuring:
[(x)];
[(x, y)        => null];
[(x, y as (b)) => null];

% function argument destructuring:
g.(z= 3, (x, y)=       [1, 2]);
g.(z= 3, (if$, by as b)= [if= 1, by= 2]);
g.(z= 3, ((x$), (y as (b)))= [[x= 1], [y= [2]]]);
% not destructuring:
g.((x));
g.(z= 3, (x, y)        => null);
g.(z= 3, (x, y as (b)) => null);

% reassignment destructuring:
(x, y) %%c%%         = [1, 2];
(x.1, y.2)           = [1, 2];
(x.i, y.j)           = [1, 2];
(x.[i + j], y.[j])   = [1, 2];
(if$, by as b.j)     = [if= 1, by= 2];
((x$), (y as (b.j))) = [[x= 1], [y= [2]]];



% class declarations
class Foo {}
public class Foo {}
private class Foo {}
class final Foo {}
class abstract Foo {}
class readonly Foo {}
class nominal Foo {}
class Foo[a, b ,] {}
class Foo<T> {}
class Foo extends Bar, Diz.<T> {}
class Foo implements Bar, Diz.<T> {}
class ClassWithCaptures[
	a,
	`b`,
] {};

% class expressions
let Foo: Class = Object && Class && (class {});
let Foo: Class = Object && Class && (class final {});
let Foo: Class = Object && Class && (class abstract {});
let Foo: Class = Object && Class && (class readonly {});
let Foo: Class = Object && Class && (class [a, b ,] extends Bar.<T> {});
let Foo: Class = Object && Class && (class <T> extends Bar.<T> {});
let Foo: Class = Object && Class && (class extends Bar, Diz.<T> {});
let Foo: Class = Object && Class && (class implements Bar, Diz.<T> {});
let classWithCaptures: Class = class [
	a,
	`b`,
] {};

% interface declarations
interface Foo {}
public interface Foo {}
private interface Foo {}
interface readonly Foo {}
interface nominal Foo {}
interface Foo<T> {}
interface Foo extends Bar, Diz.<T> {}
interface Foo inherits Bar, Diz.<T> {}

% interface type expressions
type T = unknown & (interface {});
type T = unknown & (interface readonly {});
type T = unknown & (interface <T> {});
type T = unknown & (interface extends Bar, Diz.<T> {});
type T = unknown & (interface inherits Bar, Diz.<T> {});

% class members
class Foo {
	static field: T = 42;
	public field: T = 42;
	secret field: T = 42;
	private field: T = 42;
	protected field: T = 42;
	override field: T = 42;
	final field: T = 42;
	readonly field: T = 42;
	field: Typ = 42;

	public new () {;}
	secret new () {;}
	private new () {;}
	protected new () {;}
	new (
		constructor_param: int,
		public constructor_field1: int,
		secret constructor_field2: int,
		private constructor_field3: int,
		protected constructor_field4: int,
		public override constructor_field5: int,
		public final constructor_field6: int,
		public readonly constructor_field7: int,
	) {;}

	static meth(): void {;}
	public meth(): void {;}
	secret meth(): void {;}
	private meth(): void {;}
	protected meth(): void {;}
	override meth(): void {;}
	final meth(): void {;}
	mutating meth(): void {;}
	meth<T>(): void {;}
	meth(x: int): void {;}
	meth(): int => 42;
}

% interface members
interface Foo {
	final field: this;
	field: T;

	mutating meth(): void;
	meth<T>(): void;
	meth(x: int): void;
}
