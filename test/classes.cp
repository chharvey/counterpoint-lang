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
class Foo impl Bar, Diz.<T> {}
class Foo extends Bar impl Diz.<T> {}
class Foo[var a, b ,] {}
class Foo<T>[a, var b] extends Bar, Diz.<T> {}
class ClassWithCaptures[
	var a,
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
let Foo: Class = Object && Class && (class impl Bar, Diz.<T> {});
let Foo: Class = Object && Class && (class extends Bar impl Diz.<T> {});
let Foo: Class = Object && Class && (class [a, var b ,] extends Bar.<T> {});
let classWithCaptures: Class = class [
	a,
	var 'b',
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
	% line comment
	public field: T = 42;
	secret field: T = 42;
	private field: T = 42;
	protected field: T = 42;
	override field: T = 42;
	impl field: T = 42;
	claim field: Typ;
	const field: T = 42;
	readonly field: T = 42;
	writeonly field: T = 42;
	field: Typ = 42;

	public field: T;
	public field?: T;
	public field = 42;

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
		public override constructor_field8: int,
		public impl constructor_field8: int,
		public const constructor_field6: int,
		public readonly constructor_field7: int,
		public writeonly constructor_field8: int,

		private var construtor_field8: int,
		private construtor_field9= field9: int,
		private construtor_field10= var field10: int,
		private construtor_field11= [field11a, var field11b]: int[2],

		public constructor_field12: int ?= 42,
		public constructor_field13 ?= 42,
	) {;}

	%%
	block comment
	%%
	public meth(): void {;}
	secret meth(): void {;}
	private meth(): void {;}
	protected meth(): void {;}
	override meth(): void {;}
	impl meth(): void {;}
	claim meth(): void;
	final meth(): void {;}
	mut meth(): void {;}
	meth<T>(): void {;}
	meth<out T>(): void {;}
	meth(x: int): void {;}
	meth(): void {
		super; method; this;
	}
	meth(): int => 42;
	abstractMethod(): void;

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
			public override constructor_field8: int,
			public impl constructor_field8: int,
			public const constructor_field6: int,
			public readonly constructor_field7: int,
			public writeonly constructor_field8: int,

			private var construtor_field8: int,
			private construtor_field9= field9: int,
			private construtor_field10= var field10: int,
			private construtor_field11= [field11a, var field11b]: int[2],
		) {;}
	}

	public methodGroup {
		(): void {;}
		<T>(): void {;}
		<in T>(): void {;}
		(x: int): void {;}
		(): void {
			super; method; this;
		}
		(): int => 42;
	}
	override methodGroup { (): void {;} }
	impl methodGroup { (): void {;} }
	claim methodGroup { (): void; }
	final methodGroup { (): void {;} }
	methodGroup { mut (): void {;} }
}

% interface members
interface Foo {
	field: T;
	_: T;
	readonly field: this;
	writeonly field: this;

	% constructor signatures
	new ();
	new (arg: unknown);

	mut meth(): void;
	meth<T>(): void;
	meth<out T>(): void;
	_<_>(): void;
	meth(x: int): void;
	meth(_: int): void;

	public methodGroup {
		(): void;
		<T>(): void;
		<in T>(): void;
		(x: int): void;
	}
	public methodGroup { mut (): void; }
}
