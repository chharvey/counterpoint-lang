if "hello" /* world */ %% then %% then
true else % false
(if !true
	then false
	% a line comment
	else true
);
if a then b else c;
(if a then b else c);
if a then {b} else sync { c; };;
(if a then {b} else sync { c; });
if a then {#b} else {c, d} || {e -> f};
(if a then {#b} else {c, d} || {e -> f});
if a then { run.(); };

if if a then b else c then d else e;
if a then if b then c else d else e;
if a then b else if c then d else e;

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
		if false then """{{ 0 }} 0""" else """{{ 1 }} 1""";
		(if false then """{{ 0 }} 0""" else """{{ 1 }} 1""");
		break 1;
		continue;
	};
	if true then {
		if false then """{{ 0 }} 0""" else """{{ 1 }} 1""";
	} else %% comment %% {
		(if false then """{{ 0 }} 0""" else """{{ 1 }} 1""");
	};
};
unless false then {
	"""{{ 0 }} 0""";
} else {
	"""{{ 1 }} 1""";
};
until false do {
	true;
};
do {
	true;
} until false;

for %% int %% i from %% start %% 1 to %% end %% 10 by %% increment %% 2 do {
	do {
		if false then """{{ 0 }} 0""" else """{{ 1 }} 1""";
		(if false then """{{ 0 }} 0""" else """{{ 1 }} 1""");
		break 1;
		continue;
	} while false;
	for x from if a then b else c to if a then b else c by if a then b else c do {
		do { d; } while if a then b else c;
	};
};
for _ from start to end by incr do {;};
for _ from _ to _ by _ do {;};
for i: int from 10 to 20 do {};

for await item of asynclist.() do {};
for await _ of _ do {};
for item of list do {};
for _ of _ do {};
for item: T of list do {};
for _: _ of _ do {};
for [item, i] of entries do {};
for [_, i] of entries do {};
for [item: T, i: int] of entries do {};
for [a$, b$]: S of records do {};
for [a= alpha, b= bravo] of records do {};
for [_$, _= _]: S of records do {};
for [a= [alpha, bravo]: S, c= [charlie$, 'delta'$]: S] of records do {};
for [a= [_, bravo]: S, c= [_$, _= delta]: S] of records do {};
for prop of (x: int): int => 2 * x do {};
for prop of (x: int): int { return 2 * x; } do {};
for prop of (x, y) => y * x do {};
for prop of (x, y) { return y * x; } do {};

%%
	hello
	%% "nesting" isnt allowed %%
	world
%%;

	%%%
	The thing that does something.
	@takes x the parameter
	@returns what it returns
	@throws if something bad happened
	%%
function twice(x: int): int => x * 2;

1 + 2 + sync {
	% symbols:
	@SYMBOL;
	@some_symbol;
	@'some symbol';
	@'somé symböl ? "yes" (: "no")';

	record.[@key];
	record.[@'key'];
	record.[@'this is a symbol used as a key'];
	record.%%dot%%[@key];
	record?.[@key];
	record!.[@key];
	funkshin.(@arg);
	funkshin.%%dot%%(@arg);
	funkshin?.(@arg);
	funkshin!.(@arg);
	funkshin?.<T>(@arg);
	funkshin!.<T>(@arg);

	% operators:
	!a;
	?a;
	!!a;
	? ?a;
	+x;
	-y;
	+42;
	-42;
	!@a;
	?@a;
	+@x;
	-@y;
	a~?;
	a.b~?;
	a.b.c.()~?;
	a.b~?.c;
	a.b~?.c.d~?.();
	a~??.b;
	a~?!.b;
	a~!;
	a.b~!;
	a.b.c.()~!;
	a.b~!.c;
	a.b~!.c.d~!.();
	a~!?.b;
	a~!!.b;
	c~?~!.d;
	c~!~?.d;
	x === y;
	x !== y;
	@x === @y;
	@x !== @y;
	z~~;
	z++;
	x <= y;
	x >= y;
	x == y;
	x && y;
	x || y;
	x ?? y;
	x !< y;
	x !> y;
	x != y;
	x !& y;
	x !| y;
	a ^ b;
	a * b;
	a / b;
	x as X;
	x as? X;
	x as! X;
	x as ?X;
	x as !X;
	x is y;
	x isnt y;
	a + b;
	a - b;
	x < y;
	x > y;
	@x < @y;
	@x > @y;

	type X = T~~;
	type X = T?;
	type X = T!;
	type X = T^;
	type X = T*;
	type X = T/;
	type X = T ^ [S];
	type X = T * [S];
	type X = T / [S];
	type X = T & [S];
	type X = T | [S];
	type X = T.0;
	type X = T.a;
	type X = T?.0;
	type X = T?.a;
	type X = T?.a?;
	type X = (T?).a;
	type X = (T?)?.a;

	[a, [b, b], (c + c), #spread];
	[a= 3, c= 5, key= value, punn$, 'unipunn'$, ##doublespread, _= blank];
	{+a, -b, #spread, };
	{+3, -5, #spread, };
	{+a -> -b, };
	{+3 -> -5, };
	if true then 1 else 0;
	null || (if true then 1 else 0);
	array && [key$];
	array.1.[index];
	array.%%dot%%[index];
	array?.[index];
	array!.[index];
	funkshin.%%dot%%(arg);
	funkshin?.(arg);
	funkshin!.(arg);
	funkshin?.<T>(arg);
	funkshin!.<T>(arg);
	funkshin. (call / a, #spread + b, 3, label %% args %% = c, punn$, 'unipunn'$, ##doublespread, _= blank)~~;
	funkshin.<T>%%c%%(call / a, #spread + b, 3, label %% args %% = c, punn$, ##doublespread, _= blank)++;
	funkshin.<T>%c
		(call / a, #spread + b, 3, label %% args %% = c, punn$, ##doublespread, _= blank)~~;
	funkshin.<T, #U, ##V>();
	funkshin.<A= T, #U, ##V, B= bool, C$>();
	funkshin.<A= T, #U, ##V, B= bool, C$, [D, [E]]= De, [F$, g: [H$]]= Fgh>();
	funkshin.%%c%%(
		call / a,
		#spread + b,
		3,
		label %% args %% = c,
		punn$,
		##doublespread,
		_= blank,
	)++;
	List.<T>();
	Dict.<T>();
	Set.<T>();
	Map.<T, U>();
	Mapping.<T, U>();
	structure.property + p;
	structure.'pr op' + p;
	structure.%%dot%%property + p;
	structure.%%dot%%'pr op' + p;
	array.3 + p;
	array.%%dot%%3 + p;
	array.-1 + p;
	array.+1 + p;
	array.-\b1 + p;
	array.+\b1 + p;
	structure?.property;
	structure?.'property';
	structure!.property;
	structure!.'property';
	array?.3;
	array?.-1;
	array?.+1;
	array?.-\b1;
	array?.+\b1;
	array!.3;
	array!.-1;
	array!.+1;
	array!.-\b1;
	array!.+\b1;
	awaiting~~;
	nexting++;
}

% Type claims
(5 / 3) as <float & Numeric.<T>> - 2.0;
five_thirds as <float & Numeric.<T>> - 2.0;
[(5 / 3)%%comm%%as%%comm%%<float>];
[(5 / 3)%comm
	as%comm
	<float>];
f.((5 / 3)%%comm%%as%%comm%%<Float.<T>>);
f.((5 / 3)%comm
	as%comm
	<Float.<T>>);

% type casts
five_thirds as Numeric;
(5 / 3) as Numeric;
5 / 3 as Numeric;
5 as Numeric ^ 3;
!5 as Boolean;
?5 as Boolean;
5 as! Boolean;
5 as? Boolean;
5 as !Boolean;
5 as ?Boolean;
!(5 as Numeric);

ashes;

return (a + b);
throw (c + d);
return (
	if (a + b) then c else d;
);
if (a + b) then c else d;
unless (a + b) then { return (c); } else { throw (d); };
{
	return (a + b);
	throw (c + d);
	return (
		if (a + b) then c else d;
	);
	if (a + b) then c else d;
	unless (a + b) then { return (c); } else { throw (d); };
}

(x);
(a == b);
[a == b];
((h: int ?= 0): int => h + 1);
[(h: int ?= 0): int => h + 1];
[fun= (h: int): int => h + 1];
type T = [fun: (a: int) => int];



% function parameter destructuring:
function f(param= [x, y]: int          ?= [1, 2]):         int => x + y;
function f(param= [_, y]: int          ?= [1, 2]):         int => y;
function f(param= [x: int, y: int]     ?= [1, 2]):         int => x + y;
function f(param= [_: int, y: int]     ?= [1, 2]):         int => y;
function f(until= [if$, by= b]: int    ?= [if= 1, by= 2]): int => if + b;
function f(_=     [_$,  by= _]: int    ?= [_=  1, by= 2]): int => _;
function f(_=     [_$,  _=  b]: int    ?= [_=  1, _=  2]): int => _;
function f(param= [x$: int, y= b: int] ?= [x=  1, y=  2]): int => x + b;
function f(param= [[var x], [y= [b]]]: int ?= [[1], [y= [2]]]): int => x + b;
let f: Object = (param= [x, y]: int          ?= [1, 2]):         int => x + y;
let f: Object = (param= [_, y]: int          ?= [1, 2]):         int => y;
let f: Object = (param= [x: int, y: int]     ?= [1, 2]):         int => x + y;
let f: Object = (param= [_: int, y: int]     ?= [1, 2]):         int => y;
let f: Object = (until= [if$, by= b]: int    ?= [if= 1, by= 2]): int => if + b;
let f: Object = (_=     [_$,  by= _]: int    ?= [_=  1, by= 2]): int => _;
let f: Object = (_=     [_$,  _=  b]: int    ?= [_=  1, _=  2]): int => _;
let f: Object = (param= [x$: int, y= b: int] ?= [x=  1, y=  2]): int => x + b;
let f: Object = (param= [[var x], [y= [b]]]: int ?= [[1], [y= [2]]]): int => x + b;
let f: Object = (param= [x, y]: int                  ?= [1, 2]):          int { return x + y; };
let f: Object = (param= [x: int, y: int]             ?= [1, 2]):          int { return x + y; };
let f: Object = (until= [if$, by= b]: int            ?= [if= 1, by= 2]):  int { return if + b; };
let f: Object = (param= [x$: int, y= b: int]         ?= [x= 1, y= 2]):    int { return x + b; };
let f: Object = (param= [[var x], [y= [b]]]: int ?= [[1], [y= [2]]]): int { return x + b; };

% record property destructuring:
[z= 3, [x, y]=       [1, 2]];
[z= 3, [x, _]=       [1, 2]];
[z= 3, [x= a]=       [x= 1]];
[z= 3, [if$, by= b]= [if= 1, by= 2]];
[z= 3, [_$,  by= _]= [if= 1, by= 2]];
[z= 3, [[x$], [y= [b]]]= [[x= 1], [y= [2]]]];
% not destructuring:
[[x]];
[[x, y]];
[[x= a]];
[(x, y)      => null];
[(x, y= [b]) => null];

% function argument destructuring:
g.(z= 3, [x, y]=           [1, 2]);
g.(z= 3, [x= a]=           [x= 1]);
g.(z= 3, [if$, by= b]=     [if= 1, by= 2]);
g.(z= 3, [[x$], [y= [b]]]= [[x= 1], [y= [2]]]);
% not destructuring:
g.([x]);
g.([x, y]);
g.([x= a]);
g.(z= 3, (x, y)        => [1, [2]]);
g.(z= 3, (x, y as [b]) => [1, [2]]);
