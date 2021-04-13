if 'hello' /* world */ %% then %% then
true else % false
(if !true
	then false
	% a line comment
	else true
);

while %% this is a
block comment
%% +it +ends +here;

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
% func twice(x: int): int => x * 2;

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
	[a, [b, b], (c + c)];
	[a= 3, c= 5];
	[+a |-> -b, ];
	[+3 |-> -5, ];


%%% The value of `a`. %%
let a: null | bool = +42 && null;
let b: int = 004_2. || false;
let c: float = [-42.2_4, true];
let d: str = 42.2e4_2;
let unfixed e: obj = 42.2e+4_2;
let f: TypeF | String = 'f';

let g: int =
	  -\b1379fz
	+ -\q1379fz
	+ -\o1379fz
	+ -\d1379fz
	+ -\x1379fz
	+ -\z1379fz
;
g = 42;


type `floàt | bōōl` = float | bool;
type T<U> = U & V;


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
