from 'module-path' import Component;
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

from 'module-path' import (A, B) as Bundle;
from 'module-path' import %% a %% (A, B) %% b %% as %% c %% Bundle %% d %%;
A;        %> ReferenceError01
B;        %> ReferenceError01
Bundle;   %> ReferenceError03 "`Bundle` refers to a module, but is used as a value."
Bundle.A;
Bundle.B;

from 'module-path' import (A as Alias, B) as Bundle;
from 'module-path' import type (A as Alias, B) as Bundle;
from 'module-path' import await (A as Alias, B) as Bundle;
A;            %> ReferenceError01
B;            %> ReferenceError01
Bundle;       %> ReferenceError03 "`Bundle` refers to a module, but is used as a value."
Bundle.A;     %> ReferenceError01 % (treat `Bundle.A` as a variable)
Bundle.Alias;
Bundle.B;

from 'module-path' import all as Bundle;
from 'module-path' import type all as Bundle;
from 'module-path' import await all as Bundle;
all;   %> ParseError (not an identifier)
Bundle;


export 'module-path';
