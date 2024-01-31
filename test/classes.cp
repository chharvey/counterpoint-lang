% class declarations
class Foo {}
class _ {}
public class Foo {}
secret class Foo {}
private class Foo {}
class enum Foo {}
class final Foo {}
class abstract Foo {}
class data Foo {}
class nominal Foo {}
class Foo<T> {}
class Foo<out T> {}
class Foo<_> {}
class Foo extends Bar, Diz.<T> {}
class Foo extends _, Diz.<_> {}
class Foo implements Bar, Diz.<T> {}
class Foo extends Bar implements Diz.<T> {}
class Foo [a, b ,] {}
class Foo<T> extends Bar, Diz.<T> [a, b] {}
class ClassWithCaptures [
	a,
	'b',
] {};



% class expressions
let Foo: Class = Object && Class && (class {});
let Foo: Class = Object && Class && (class enum {});
let Foo: Class = Object && Class && (class final {});
let Foo: Class = Object && Class && (class abstract {});
let Foo: Class = Object && Class && (class data {});
let Foo: Class = Object && Class && (class <T> extends Bar.<T> {});
let Foo: Class = Object && Class && (class <in T> extends Bar.<T> {});
let Foo: Class = Object && Class && (class extends Bar, Diz.<T> {});
let Foo: Class = Object && Class && (class extends _, Diz.<_> {});
let Foo: Class = Object && Class && (class implements Bar, Diz.<T> {});
let Foo: Class = Object && Class && (class extends Bar implements Diz.<T> {});
let Foo: Class = Object && Class && (class extends Bar.<T> [a, b ,] {});
let classWithCaptures: Class = class [
	a,
	'b',
] {};



% interface declarations
interface Foo {}
public interface Foo {}
secret interface Foo {}
private interface Foo {}
interface data Foo {}
interface nominal Foo {}
interface Foo<T> {}
interface Foo<out T> {}
interface Foo extends Bar, Diz.<T> {}
interface Foo inherits Bar, Diz.<T> {}
interface _ inherits _, Diz.<_> {}
interface Foo extends Bar inherits Diz.<T> {}



% interface type expressions
type T = unknown & (interface {});
type T = unknown & (interface data {});
type T = unknown & (interface <T> {});
type T = unknown & (interface <in T> {});
type T = unknown & (interface extends Bar, Diz.<T> {});
type T = unknown & (interface inherits Bar, Diz.<T> {});
type T = unknown & (interface inherits _, Diz.<_> {});
type T = unknown & (interface extends Bar inherits Diz.<T> {});



% class members
class Foo {
	static {
		field: T = 42;
		_: T = 42;
		meth(): void {
			super; static; hyper; method; this;
		}
		_(): void {
			super; static; hyper; method; this;
		}
		public methodGroup {
			(): void {;}
			async (): void {;}
			gen (): void {;}
			<T>(): void {;}
			(x: int): void {;}
			(): void {
				super; static; hyper; method; this;
			}
			(): int => 42;
		}
		public override methodGroup { (): void {;} }
		public final methodGroup { (): void {;} }
		public mut methodGroup { (): void {;} }
	}


	% line comment
	public field: T = 42;
	secret field: T = 42;
	private field: T = 42;
	protected field: T = 42;
	const field: T = 42;
	readonly field: T = 42;
	writeonly field: T = 42;
	field: Typ = 42;
	claim field: Typ;

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
		public const constructor_field6: int,
		public readonly constructor_field7: int,
		public writeonly constructor_field8: int,

		private unfixed construtor_field8: int,
		private construtor_field9= field9: int,
		private construtor_field10= unfixed field10: int,
		private construtor_field11= [field11a, unfixed field11b]: int[2],
	) {;}

	%%
	block comment
	%%
	public meth(): void {;}
	secret meth(): void {;}
	private meth(): void {;}
	protected meth(): void {;}
	override meth(): void {;}
	final meth(): void {;}
	mut meth(): void {;}
	async meth(): void {;}
	gen meth(): void {;}
	meth<T>(): void {;}
	meth<out T>(): void {;}
	meth(x: int): void {;}
	meth(): void {
		super; static; hyper; method; this;
	}
	meth(): int => 42;
	abstractMethod(): void;
	claim meth(): void;

	return(ab: void): void { return (ab); }
	throw(cd: void): void { throw (cd); }
	if(ef: void): void { if (a + b) then c else d; }
	unless(gh: void): void { unless (a + b) then c else d; }

	% constructor group
	private new {
		() {;}
		(
			constructor_param: int,
			public constructor_field1: int,
			secret constructor_field2: int,
			private constructor_field3: int,
			protected constructor_field4: int,
			public const constructor_field6: int,
			public readonly constructor_field7: int,
			public writeonly constructor_field8: int,

			private unfixed construtor_field8: int,
			private construtor_field9= field9: int,
			private construtor_field10= unfixed field10: int,
			private construtor_field11= [field11a, unfixed field11b]: int[2],
		) {;}
	}

	public methodGroup {
		(): void {;}
		async (): void {;}
		gen (): void {;}
		<T>(): void {;}
		<in T>(): void {;}
		(x: int): void {;}
		(): void {
			super; static; hyper; method; this;
		}
		(): int => 42;
	}
	override methodGroup { (): void {;} }
	final methodGroup { (): void {;} }
	mut methodGroup { (): void {;} }
	claim methodGroup { (): void; }
}

% interface members
interface Foo {
	field: T;
	_: T;
	readonly field: this;
	writeonly field: this;

	mut meth(): void;
	async meth(): void;
	gen meth(): void;
	meth<T>(): void;
	meth<out T>(): void;
	_<_>(): void;
	meth(x: int): void;
	meth(_: int): void;

	public methodGroup {
		(): void;
		async (): void;
		gen (): void;
		<T>(): void;
		<in T>(): void;
		(x: int): void;
	}
	public mut methodGroup { (): void; }
}
