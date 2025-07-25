type TypeKeywords    = never | bool | sym | int | float | str | unknown;
type TypeClasses     = Object | Class | List | Dict | Set | Map;
type TypeConstants   = null | false | true;
type TypeNonKeywords = boolen | integer | string | object | class | list | dict | set | map;

let value_keywords     = null || false || true;
let value_classes      = Object || Class || List || Dict || Set || Map;
let value_non_keywords = nil || object || list || dict || set || map;


% symbols
@symb;
@_;
@'symb ?  + ab';

% numbers
42;
+42
-42
4_2;
+4_2
-4_2
44.42;
+44.42;
-42.42;
4_4.4_2;
+4_4.4_2;
-4_2.4_2;
42.42e42;
+42.42e42;
-42.42e42;
4_2.4_2e4_2;
+4_2.4_2e4_2;
-4_2.4_2e4_2;
42.42e+42;
+42.42e+42;
-42.42e+42;
4_2.4_2e+4_2;
+4_2.4_2e+4_2;
-4_2.4_2e+4_2;
42.42e-42;
+42.42e-42;
-42.42e-42;
4_2.4_2e-4_2;
+4_2.4_2e-4_2;
-4_2.4_2e-4_2;


% augmentation operators
val ^= 42;
val *= 42;
val /= 42;
val += 42;
val -= 42;
val &&= 42;
val !&= 42;
val ||= 42;
val !|= 42;

__a && __b && c_;
'__a' && '__b' && 'c_';
004__2. || 2.4_ || \xa__b || \xa_b_;
a + _ + 'c';
type T = U | _;
a._;
_.a;
type T = U._;
type T = _.U;

a.b;
a?.b;
a!.b;
a.'b';
a?.'b';
a!.'b';
.b;
.'b';
type T = A.B;
type T = A.'B';
type T = .'B';

if "hello" /* world */ %% then %% then
true else % false
else {if !true
	then false
	% a line comment
	else true
}

while %% this is a
block comment
%% it ends here

%%
	hello
	%% "nesting" isnt allowed %%
	world
%%

	%%%
	The thing that does something.
	@takes x the parameter
	@returns what it returns
	@throws if something bad happened
	%%
function twice(x: int): int => x * 2;

(
	% operators:
	!a
	?a
	+x
	-y
	+42_;
	-42_;
	++42; % IGNORE
	+-42;
	-+42;
	--42;
	a + b
	a - b
	a ^ b
	a * b
	a / b
	x < y
	x > y
	x <= y
	x >= y
	x !< y
	x !> y
	x == y
	x != y
	x is y
	x isnt y
	x && y
	x || y
	x !& y
	x !| y
	T & S
	T | S
	T!
	T?
	a: b;
	a = b;
	[a, b, c];
	[a= 3, c= 5];
	[+a -> -b, ]
	[+3 -> -5, ]
	1+2 % lexes as 2 numbers: `1` and `+2`
	1+ 2 % lexes as number, punct, number
)


%%% The value of `a`. %%
let a: null | bool = +42 && null;
let b: int = 004_2. || false;
let c: float = -42.2_4 || true;
let d: str = 42.2e4_2;
let var e: Object = 42.2e+4_2;
let f: TypeF | String | obj = "f";

let g: int =
	+ -\b1379fz
	+ -\q1379fz
	+ -\o1379fz
	+ -\d1379fz
	+ -\x1379fz
	+ -\z1379fz
;


type 'floàt | bōōl' = float | bool;
type T<U> = U & V;


"a string that
contains a % comment
and then a new line
";

"a string that
contains a % comment but no new line";

"a string that
ends in a line comment %";

"a string that
contains %% a
comment %% and an end comment.";

"a string that
contains %% a
comment but no end comment.";

"a string that
ends in a multiline comment %%";


"a string \" that escapes
a quote \\ and a backslash.";
"more escapes:
\s space
\t tab
\n newline
\r carriage-return
\\ slash
\" quote
\% percent";
"a \u{}string. a \u{bada55}string. a \u{ bada55}string. a \u{bada55 }string. a \u{badass }string.";
"a \U{}string. a \U{bada55}string. a \U{ bada55}string. a \U{bada55 }string. a \U{badass }string.";
"a \u{bad_a55}string. a \u{bad_ass}string.";
"a \U{bad_a55}string. a \U{bad_ass}string.";
"a \u{bad__a55}string. a \u{bad__ass}string.";
"a \U{bad__a55}string. a \U{bad__ass}string.";
"a \u{bad_a55_}string. a \u{bad_ass_}string.";
"a \U{bad_a55_}string. a \U{bad_ass_}string.";
"a \u{
}string.";
"a \U{
}string.";
"\u can be \used without brackets anywhere\u";
"a string \% escaping a percent and \{some brackets\}.";
"line continuations\
replace newlines with spaces."

"""an interpolated {{ var / %% a comm %% +42.3 }} string""";
"""an interpolated {{ var + % a comm
-42.3 }} string""";
"""warning! {{ % this }} won’t parse.""";

"""no escapes:
\s \t \n \r \\ \" \% \ \u{20}
\{\{ var \}\}
{{ "\{\{ var \}\}" }}
\{\{ {{ var }} \}\}
{{ "\{\{" }}{{ var }}{{ "\}\}" }}
""";
