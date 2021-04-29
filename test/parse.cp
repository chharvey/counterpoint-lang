if 'hello' /* world */ %% then %% then
true else % false
(if !true
	then false
	% a line comment
	else true
);

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

for %% int %% i from %% start %% 1 to %% end %% 10 do {
	do {
		if false then '''{{ 0 }} 0''' else '''{{ 1 }} 1''';
		(if false then '''{{ 0 }} 0''' else '''{{ 1 }} 1''');
		break 1;
		continue;
	} while false;
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

%% these should all fail parsing
and thus be colored to indicate as such. %%
% constants
type T<null, false, true, never, void, bool, int, float, str, obj, unknown> = T;
type T = (null: T, false: T, true: T, never: T, void: T, bool: T, int: T, float: T, str: T, obj: T, unknown: T) -> {U};
func f(null: T, false: T, true: T, never: T, void: T, bool: T, int: T, float: T, str: T, obj: T, unknown: T): U {;}
f.(null= expr, false= expr, true= expr, never= expr, void= expr, bool= expr, int= expr, float= expr, str= expr, obj= expr, unknown= expr)~;
f.(null$, false$, true$, never$, void$, bool$, int$, float$, str$, obj$, unknown$)~;
type null; type false; type true; type never; type void; type bool; type int; type float; type str; type obj; type unknown;
let null; let false; let true; let never; let void; let bool; let int; let float; let str; let obj; let unknown;
func null; func false; func true; func never; func void; func bool; func int; func float; func str; func obj; func unknown; =>;
class null; class false; class true; class never; class void; class bool; class int; class float; class str; class obj; class unknown; {}
interface null; interface false; interface true; interface never; interface void; interface bool; interface int; interface float; interface str; interface obj; interface unknown; {}
% operators
type T<mutable, is, isnt, if, then, else> = T;
type T = (mutable: T, is: T, isnt: T, if: T, then: T, else: T) -> {U};
func f(mutable: T, is: T, isnt: T, if: T, then: T, else: T): U {;}
f.(mutable= expr, is= expr, isnt= expr, if= expr, then= expr, else= expr)~;
f.(mutable$, is$, isnt$, if$, then$, else$)~;
type mutable; type is; type isnt; type if; type then; type else;
let mutable; let is; let isnt; let if; let then; let else;
func mutable; func is; func isnt; func if; func then; func else; =>;
class mutable; class is; class isnt; class if; class then; class else; {}
interface mutable; interface is; interface isnt; interface if; interface then; interface else; {}
% storage types
type T<type, let, func, class, interface> = T;
type T = (type: T, let: T, func: T, class: T, interface: T) -> {U};
func f(type: T, let: T, func: T, class: T, interface: T): U {;}
f.(type= expr, let= expr, func= expr, class= expr, interface= expr)~; {});
f.(type$, let$, func$, class$, interface$)~; {});
type type; type let; type func; type class; type interface;
let type; let let; let func; let class; let interface;
func type; func func ; func func; func class; func interface; =>;
class type; class let; class func; class class; class interface; {}
interface type; interface let; interface func; interface class; interface interface; {}
% storage modifiers
type T<public, private, final, abstract, immutable, nominal, unfixed, extends, implements, inherits, narrows, widens> = T;
type T = (public: T, private: T, final: T, abstract: T, immutable: T, nominal: T, unfixed: T, extends: T, implements: T, inherits: T, narrows: T, widens: T) -> {U};
func f(public: T, private: T, final: T, abstract: T, immutable: T, nominal: T, unfixed: T, extends: T, implements: T, inherits: T, narrows: T, widens: T): U {;}
f.(public= expr, private= expr, final= expr, abstract= expr, immutable= expr, nominal= expr, unfixed= expr, extends= expr, implements= expr, inherits= expr, narrows= expr, widens= expr)~;
f.(public$, private$, final$, abstract$, immutable$, nominal$, unfixed$, extends$, implements$, inherits$, narrows$, widens$)~;
type public; type private; type final; type abstract; type immutable; type nominal; type unfixed; type extends; type implements; type inherits; type narrows; type widens;
let public; let private; let final; let abstract; let immutable; let nominal; let unfixed; let extends; let implements; let inherits; let narrows; let widens;
func public; func private; func final; func abstract; func immutable; func nominal; func unfixed; func extends; func implements; func inherits; func narrows; func widens; =>;
class public; class private; class final; class abstract; class immutable; class nominal; class unfixed; class extends; class implements; class inherits; class narrows; class widens; {}
interface public; interface private; interface final; interface abstract; interface immutable; interface nominal; interface unfixed; interface extends; interface implements; interface inherits; interface narrows; interface widens; {}
% control
type T<unless, while, until, do, for, from, to, by, in, break, continue, return, throw> = T;
type T = (unless: T, while: T, until: T, do: T, for: T, from: T, to: T, by: T, in: T, break: T, continue: T, return: T, throw: T) -> {U};
func f(unless: T, while: T, until: T, do: T, for: T, from: T, to: T, by: T, in: T, break: T, continue: T, return: T, throw: T): U {;}
f.(unless= expr, while= expr, until= expr, do= expr, for= expr, from= expr, to= expr, by= expr, in= expr, break= expr, continue= expr, return= expr, throw= expr)~;
f.(unless$, while$, until$, do$, for$, from$, to$, by$, in$, break$, continue$, return$, throw$)~;
type unless; type while; type until; type do; type for; type from; type to; type by; type in; type break; type continue; type return; type throw;
let unless; let while; let until; let do; let for; let from; let to; let by; let in; let break; let continue; let return; let throw;
func unless; func while; func until; func do; func for; func from; func to; func by; func in; func break; func continue; func return; func throw; =>;
class unless; class while; class until; class do; class for; class from; class to; class by; class in; class break; class continue; class return; class throw; {}
interface unless; interface while; interface until; interface do; interface for; interface from; interface to; interface by; interface in; class break; interface continue; interface return; interface throw; {}
% other
type T<as> = T;
type T = (as: T) -> {U};
func f(as: T): U {;}
f.(as= expr)~;
f.(as$)~;
type as;
let as;
func as; =>;
class as; {}
interface as; {}

%% these should *not* fail parsing
because keywords are allowed identifiers here. %%
type T = [null: T, false: T, true: T, never: T, void: T, bool: T, int: T, float: T, str: T, obj: T, unknown: T];
type T = [mutable: T, is: T, isnt: T, if: T, then: T, else: T];
type T = [type: T, let: T, func: T, class: T, interface: T];
type T = [public: T, private: T, final: T, abstract: T, immutable: T, nominal: T, unfixed: T, extends: T, implements: T, inherits: T, narrows: T, widens: T];
type T = [unless: T, while: T, until: T, do: T, for: T, from: T, to: T, by: T, in: T, break: T, continue: T, return: T, throw: T];
type T = [as: T];
[null= expr, false= expr, true= expr, never= expr, void= expr, bool= expr, int= expr, float= expr, str= expr, obj= expr, unknown= expr];
[mutable= expr, is= expr, isnt= expr, if= expr, then= expr, else= expr];
[type= expr, let= expr, func= expr, class= expr, interface= expr];
[public= expr, private= expr, final= expr, abstract= expr, immutable= expr, nominal= expr, unfixed= expr, extends= expr, implements=expr, inherits=expr, narrows= expr, widens= expr];
[unless= expr, while= expr, until= expr, do= expr, for= expr, from= expr, to= expr, by= expr, in= expr, break= expr, continue= expr, return= expr, throw= expr];
[as= expr];
[null$, false$, true$, never$, void$, bool$, int$, float$, str$, obj$, unknown$];
[mutable$, is$, isnt$, if$, then$, else$];
[type$, let$, func$, class$, interface$];
[public$, private$, final$, abstract$, immutable$, nominal$, unfixed$, extends$, implements$, inherits$, narrows$, widens$];
[unless$, while$, until$, do$, for$, from$, to$, by$, in$, break$, continue$, return$, throw$];
[as$];
object.null; object.false; object.true; object.never; object.void; object.bool; object.int; object.float; object.str; object.obj; object.unknown;
object.mutable; object.is; object.isnt; object.if; object.then; object.else;
object.type; object.let; object.func; object.class; object.interface;
object.public; object.private; object.final; object.abstract; object.immutable; object.nominal; object.unfixed; object.extends; object.implements; object.inherits; object.narrows; object.widens;
object.unless; object.while; object.until; object.do; object.for; object.from; object.to; object.by; object.in; object.break; object.continue; object.return; object.throw;
object.as;


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
private immutable class Foo {}
final class Foo {}
abstract class Foo
immutable class Foo {}
class nominal Foo {}
class Foo<T> {}
class Foo extends Bar, Diz.<T> {}
class Foo implements Bar, Diz.<T> {}

% class expressions
let Foo: Class = Object && Class && (class {});
let Foo: Class = Object && Class && (public class {});
let Foo: Class = Object && Class && (private class {});
let Foo: Class = Object && Class && (final class {});
let Foo: Class = Object && Class && (abstract class {});
let Foo: Class = Object && Class && (immutable class {});
let Foo: Class = Object && Class && (class <T> extends Bar.<T> {});
let Foo: Class = Object && Class && (class extends Bar, Diz.<T> {});
let Foo: Class = Object && Class && (class implements Bar, Diz.<T> {});

% interface declarations
interface Foo {}
public interface Foo {}
private interface Foo {}
immutable interface Foo {}
interface nominal Foo {}
interface Foo<T> {}
interface Foo extends Bar, Diz.<T> {}
interface Foo inherits Bar, Diz.<T> {}

% interface type expressions
type T = unknown & (interface {});
type T = unknown & (immutable interface {});
type T = unknown & (interface <T> {});
type T = unknown & (interface extends Bar, Diz.<T> {});
type T = unknown & (interface inherits Bar, Diz.<T> {});
