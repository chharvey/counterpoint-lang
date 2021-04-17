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
	T & S;
	T | S;
	T!;
	T?;
	[a, [b, b], (c + c), #spread];
	[a= 3, c= 5, key, punn$, ##doublespread];
	[+a |-> -b, ];
	[+3 |-> -5, ];
	if true then 1 else 0;
	null || (if true then 1 else 0);
	array && [key$];
	array.[index];
	array.%%dot%%[index];
	funkshin. (call, #spread, 3, 4, label %% args %% = 2, punn$, ##doublespread)~;
	structure.property;
	structure. `pr op`;
	structure. +`pr op`;
	structure.%%dot%%`pr op`;
	array.3;
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

let %%unfixed%% g: int =
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
(unfixed h: int) => h + 1;
(%%unfixed%% h: int) => h + 1;

(a == b);
[a == b];
((h: int = 0) => h + 1);
[(h: int = 0) => h + 1];
[fun= (h: int) => h + 1];
[fun: (int) -> {int}];

type `floàt | bōōl` = `floàt | bōōl` | float | bool;
type T<U> = U & V.<W>;
type U<V narrows W.<int>> = V | W.<X>;
type U<V = W.<int>> = V | W.<X>;

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

func funkshin(param: annot = initial): void {;}
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
func derivative<T narrows float>(lambda: (T) -> {T}, delta: T): (T) -> {T} {
	return (x: T): T => (lambda.(x + delta)~ - lambda.(x)~) / delta;
}
func subset<T = Set.<null>, U widens T>(a: Set.<T>, b: Set.<U>): bool {;}

let x: (str) -> {str} = (a: str) => '''<x>{{ a }}</x>''';
let x: (str) -> {str} = (a: str) {
	func y(): void {;}
	let x: str = 'x';
	return '''<{{ x }}>{{ a }}</{{ x }}>''';
};
let x: <T widens U, U = Set.<null>>(a: Set.<T>, b: Set.<U>): bool {;}

func returnFunc(): obj => (x) => x + 1;
func returnFunc(): (int) -> {int} => (x) => x + 1;
func returnFunc(): {obj} => (x) => x + 1;


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

% record property destructuring:
[(x, y)=       [1, 2]];
[(x$, y as b)= [x= 1, y= 2]];
[((x$), (y as (b)))= [[x= 1], [y= [2]]]];

% function argument destructuring:
g.(z= 3, (x, y)=       [1, 2]);
g.(z= 3, (x$, y as b)= [x= 1, y= 2]);
g.(z= 3, ((x$), (y as (b)))= [[x= 1], [y= [2]]]);

% reassignment destructuring:
(x.i, y.j)           = [1, 2];
(x$, y as b.j)       = [x= 1, y= 2];
((x$), (y as (b.j))) = [[x= 1], [y= [2]]];
