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
let null;
let false;
let true;
let bool;
let int;
let float;
let str;
let obj;
% operators
let mutable;
let is;
let isnt;
let if;
let then;
let else;
% storage types/modifiers
let let;
let unfixed;
let narrows;
let widens;
% control
let while;
let do;
let for;
let from;
let to;
let by;
let in;
let break;
let continue;
% other
let as;

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
let (x$, y as b): int      = [x= 1, y= 2];
let (x$: int, y as b: int) = [x= 1, y= 2];
let ((unfixed x), (y as (b))): int = [[1], [y= [2]]];

% function parameter destructuring:
func f(param as (x, y): int            = [1, 2]):       int => x + y;
func f(param as (x: int, y: int)       = [1, 2]):       int => x + y;
func f(param as (x$, y as b): int      = [x= 1, y= 2]): int => x + b;
func f(param as (x$: int, y as b: int) = [x= 1, y= 2]): int => x + b;
func f(param as ((unfixed x), (y as (b))): int = [[1], [y= [2]]]): int => x + b;
let f: obj = (param as (x, y): int            = [1, 2]):       int => x + y;
let f: obj = (param as (x: int, y: int)       = [1, 2]):       int => x + y;
let f: obj = (param as (x$, y as b): int      = [x= 1, y= 2]): int => x + b;
let f: obj = (param as (x$: int, y as b: int) = [x= 1, y= 2]): int => x + b;
let f: obj = (param as ((unfixed x), (y as (b))): int = [[1], [y= [2]]]): int => x + b;
let f: obj = (param as (x, y): int            = [1, 2]):       int { return x + y; };
let f: obj = (param as (x: int, y: int)       = [1, 2]):       int { return x + y; };
let f: obj = (param as (x$, y as b): int      = [x= 1, y= 2]): int { return x + b; };
let f: obj = (param as (x$: int, y as b: int) = [x= 1, y= 2]): int { return x + b; };
let f: obj = (param as ((unfixed x), (y as (b))): int = [[1], [y= [2]]]): int { return x + b; };

% record property destructuring:
[(x, y)=       [1, 2]];
[(x$, y as b)= [x= 1, y= 2]];
[((x$), (y as (b)))= [[x= 1], [y= [2]]]];
% not destructuring:
[(x)];
[(x, y)        => null];
[(x, y as (b)) => null];

% function argument destructuring:
g.(z= 3, (x, y)=       [1, 2]);
g.(z= 3, (x$, y as b)= [x= 1, y= 2]);
g.(z= 3, ((x$), (y as (b)))= [[x= 1], [y= [2]]]);
% not destructuring:
g.((x));
g.(z= 3, (x, y)        => null);
g.(z= 3, (x, y as (b)) => null);

% reassignment destructuring:
(x, y)               = [1, 2];
(x.1, y.2)           = [1, 2];
(x.i, y.j)           = [1, 2];
(x.[i + j], y.[j])   = [1, 2];
(x$, y as b.j)       = [x= 1, y= 2];
((x$), (y as (b.j))) = [[x= 1], [y= [2]]];
