if 'hello' /* world */ %% then %% then
true else % false
(if !true
	then false
	% a line comment
	else true
);
if a then b else c;
(if a then b else c);
if a then {#b} else {c, d} || {e -> f};
if a then { run.(); };
(if a then {#b} else {c});

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
for i: int from 10 to 20 do {};

for await item of asynclist.() do {};
for item of list do {};
for item: T of list do {};
for (item, i) of entries do {};
for (item: T, i: int) of entries do {};
for (a$, b$): S of records do {};
for (a as alpha, b as bravo) of records do {};
for (a as (alpha, bravo): S, c as (charlie$, delta$): S) of records do {};
for prop of (x: int): int => 2 * x do {};
for prop of (x: int): int { return 2 * x; } do {};
for prop of (x, y) => y * x do {};
for prop of (x, y) { return y * x; } do {};

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
	x is y;
	x isnt y;
	x === y;
	x !== y;
	x == y;
	x != y;
	x && y;
	x || y;
	x !& y;
	x !| y;
	type X = T?;
	type X = T!;
	type X = T*;
	type X = T/;
	type X = T & S;
	type X = T | S;
	type X = T ^ S;
	[a, [b, b], (c + c), #spread];
	[a= 3, c= 5, key= value, punn$, ##doublespread];
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
	funkshin. (call / a, #spread + b, 3, label %% args %% = c, punn$, ##doublespread)~~;
	funkshin.<T>%%c%%(call / a, #spread + b, 3, label %% args %% = c, punn$, ##doublespread)++;
	funkshin.<T>%c
		(call / a, #spread + b, 3, label %% args %% = c, punn$, ##doublespread)~~;
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
	)++;
	List.<T>();
	Hash.<T>();
	Set.<T>();
	Map.<T, U>();
	Mapping.<T, U>();
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
	structure?.property;
	structure?.`property`;
	structure!.property;
	structure!.`property`;
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
<float & Numeric.<T>>(5 / 3) - 2.0;
<float & Numeric.<T>>five_thirds - 2.0;
[<float>%%comm%%(5 / 3)];
[<float>%comm
	(5 / 3)];
f.(<Float.<T>>%%comm%%(5 / 3));
f.(<Float.<T>>%comm
	(5 / 3));

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
((h: int = 0): int => h + 1);
[(h: int = 0): int => h + 1];
[fun= (h: int): int => h + 1];
type T = [fun: (a: int) => int];



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
