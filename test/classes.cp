% class declarations
class Foo {}
public class Foo {}
private class Foo {}
class final Foo {}
class abstract Foo {}
class readonly Foo {}
class nominal Foo {}
class Foo<T> {}
class Foo extends Bar, Diz.<T> {}
class Foo implements Bar, Diz.<T> {}
class Foo extends Bar implements Diz.<T> {}
class Foo [a, b ,] {}
class Foo<T> extends Bar, Diz.<T> [a, b] {}
class ClassWithCaptures [
	a,
	`b`,
] {};



% class expressions
let Foo: Class = Object && Class && (class {});
let Foo: Class = Object && Class && (class final {});
let Foo: Class = Object && Class && (class abstract {});
let Foo: Class = Object && Class && (class readonly {});
let Foo: Class = Object && Class && (class <T> extends Bar.<T> {});
let Foo: Class = Object && Class && (class extends Bar, Diz.<T> {});
let Foo: Class = Object && Class && (class implements Bar, Diz.<T> {});
let Foo: Class = Object && Class && (class extends Bar implements Diz.<T> {});
let Foo: Class = Object && Class && (class extends Bar.<T> [a, b ,] {});
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
interface Foo extends Bar inherits Diz.<T> {}



% interface type expressions
type T = unknown & (interface {});
type T = unknown & (interface readonly {});
type T = unknown & (interface <T> {});
type T = unknown & (interface extends Bar, Diz.<T> {});
type T = unknown & (interface inherits Bar, Diz.<T> {});
type T = unknown & (interface extends Bar inherits Diz.<T> {});



% class members
class Foo {
	static {
		field: T = 42;
		meth(): void {
			super; static; hyper; method; this;
		}
		public methodGroup {
			(): void {;}
			async (): void {;}
			<T>(): void {;}
			(x: int): void {;}
			(): void {
				super; static; hyper; method; this;
			}
			(): int => 42;
		}
		public override methodGroup { (): void {;} }
		public final methodGroup { (): void {;} }
		public mutating methodGroup { (): void {;} }
	}


	% line comment
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

	%%
	block comment
	%%
	public meth(): void {;}
	secret meth(): void {;}
	private meth(): void {;}
	protected meth(): void {;}
	override meth(): void {;}
	final meth(): void {;}
	mutating meth(): void {;}
	async meth(): void {;}
	meth<T>(): void {;}
	meth(x: int): void {;}
	meth(): void {
		super; static; hyper; method; this;
	}
	meth(): int => 42;

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
			public override constructor_field5: int,
			public final constructor_field6: int,
			public readonly constructor_field7: int,
		) {;}
	}

	public methodGroup {
		(): void {;}
		async (): void {;}
		<T>(): void {;}
		(x: int): void {;}
		(): void {
			super; static; hyper; method; this;
		}
		(): int => 42;
	}
	public override methodGroup { (): void {;} }
	public final methodGroup { (): void {;} }
	public mutating methodGroup { (): void {;} }
}

% interface members
interface Foo {
	final field: this;
	field: T;

	mutating meth(): void;
	async meth(): void;
	meth<T>(): void;
	meth(x: int): void;

	public methodGroup {
		(): void;
		async (): void;
		<T>(): void;
		(x: int): void;
	}
	public mutating methodGroup { (): void; }
}
