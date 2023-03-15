from 'module-path' import Component;
from 'module-path' import _;
from 'module-path' import type Component;
from 'module-path' import await Component;
from %% a %% 'module-path' %% b %% import %% c %% Component %% d %%;
Component;

from 'module-path' import Component as Alias;
from 'module-path' import type Component as Alias;
from 'module-path' import await Component as Alias;
from % a
'module-path' % b
import % c
Component % d
as % e
Alias% f
;
Component; %> ReferenceError01
Alias;

from 'module-path' import (A, B);
from 'module-path' import (_, B);
from 'module-path' import type (A, B);
from 'module-path' import await (A, B);
from 'module-path' import (A, %% a %% B %% b %%);
from 'module-path' import (
	A,
	B,
);
A;
B;

from 'module-path' import (A as Alias, B);
from 'module-path' import (A as _, B);
from 'module-path' import type (A as Alias, B);
from 'module-path' import await (A as Alias, B);
from 'module-path' import (A %% a %% as %% b %% Alias, B);
from 'module-path' import (
	A % a
	as % b
	Alias,
	B,
);
A;     %> ReferenceError01
Alias;
B;

from 'module-path' import (A as Alias, B) as Namespace;
from 'module-path' import (A as Alias, B) as _;
from 'module-path' import type (A as Alias, B) as Namespace;
from 'module-path' import await (A as Alias, B) as Namespace;
from 'module-path' import (A %% a %% as %% b %% Alias, B) as Namespace;
from 'module-path' import (
	A % a
	as % b
	Alias,
	B,
) as Namespace;
A;     %> ReferenceError01
Alias; %> ReferenceError01
B;     %> ReferenceError01
Namespace;       %> ReferenceError03: `Namespace` refers to a module, but is used as a value.
Namespace.A;     %> TypeError04: Property `A` does not exist on type `Namespace`.
Namespace.Alias;
Namespace.B;

from 'module-path' import all as Namespace;
from 'module-path' import type all as Namespace;
from 'module-path' import await all as Namespace;
from 'module-path' import %% a %% all %% b %% as %% c %% Namespace %% d %%;
all;         %> ParseError (not an identifier)
A;           %> ReferenceError01
B;           %> ReferenceError01
Namespace;   %> ReferenceError03: `Namespace` refers to a module, but is used as a value.
Namespace.A;
Namespace.B;


export 'module-path';
export 'module-path' as Namespace;
export 'module-path' as _;
