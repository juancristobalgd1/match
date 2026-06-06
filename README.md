# match

**Lightweight pattern matching for JavaScript — < 1 KB, zero dependencies**

- Clean array syntax, formatter-friendly
- Destructuring with `$variable`
- Wildcards `_` for any value
- OR patterns: `or(1, 2, 3)`
- Error helpers: `throwError()`
- Exhaustive mode (throws if no match)
- TypeScript support
- < 1 KB minified · 0 dependencies

## Installation

```bash
npm install match-pro
```

## Two syntaxes

### Array syntax — for complex patterns

```javascript
import { match, _ } from "match-pro";

const user = { name: "Ana", role: "admin" };

match(user)(
  [{ role: "admin", name: "$n" }, (b) => `Hello ${b.n}`],
  [{ role: "user",  name: "$n" }, (b) => `Hi ${b.n}`],
  [_, "Guest"]
);
// => "Hello Ana"
```

### Flat syntax — for inline, one-liner use

```javascript
import { match, _ } from "match-pro";

match(n, 0, "zero", 1, "one", 42, "the answer", _, "other");

// Inline in a function — beats if/else as an expression
const classify = (n) => match(n,
  (x) => x >= 18, "adult",
  (x) => x >= 13, "teen",
  _, "child"
);
```

**Pattern** can be a primitive, object, array, guard function, OR pattern, or wildcard `_`.  
**Handler** can be a direct value or `(bindings, value) => result`.

## Quick examples

### Numbers

```javascript
match(2)(
  [1, "uno"],
  [2, "dos"],
  [3, "tres"],
  [_, "otro"]
);
// => "dos"
```

### Destructuring

```javascript
match({ name: "Ana", role: "admin" })(
  [{ name: "$name", role: "admin" }, (b) => `Hello boss ${b.name}`],
  [{ name: "$name" },               (b) => `Hello ${b.name}`],
  [_, "Anonymous"]
);
// => "Hello boss Ana"
```

### Arrays / Tuples

```javascript
match([1, 999, 3])(
  [[1, _, 3], "First and last match"],
  [[_, 2, _], "Middle is 2"],
  [_, "Other"]
);
// => "First and last match"
```

### Guards (predicates)

```javascript
match(17)(
  [(x) => x >= 18, "Adult"],
  [(x) => x >= 13, "Teenager"],
  [_, "Child"]
);
// => "Teenager"
```

### Redux actions

```javascript
const action = { type: "ADD_TODO", payload: { text: "Learn match" } };

match(action)(
  [{ type: "ADD_TODO",    payload: { text: "$t" } }, (b) => `Add: ${b.t}`],
  [{ type: "TOGGLE_TODO", payload: { id: "$id" }  }, (b) => `Toggle #${b.id}`],
  [{ type: "DELETE_TODO", payload: { id: "$id" }  }, (b) => `Delete #${b.id}`],
  [_, "Unknown action"]
);
// => "Add: Learn match"
```

## Real-world use cases

### State machine

```javascript
const nextState = (state, event) =>
  match({ state, event })(
    [{ state: "idle",    event: "start"   }, "loading"],
    [{ state: "loading", event: "success" }, "ready"],
    [{ state: "loading", event: "error"   }, "error"],
    [{ state: "error",   event: "retry"   }, "loading"],
    [{ state: _,         event: "reset"   }, "idle"],
    [_, state]
  );

nextState("idle", "start"); // => "loading"
```

### Form validation

```javascript
const validate = (form) =>
  match(form)(
    [{ email: "$e", password: "$p" }, (b) => validateLogin(b.e, b.p)],
    [{ email: "$e" },                 () => "Password missing"],
    [_, "Incomplete data"]
  );
```

### Routing

```javascript
const route = (req) =>
  match(req)(
    [{ method: "GET",  path: "/users"     }, () => listUsers()],
    [{ method: "GET",  path: "/users/$id" }, (b) => getUser(b.id)],
    [{ method: "POST", path: "/users"     }, () => createUser()],
    [_, () => notFound()]
  );
```

### Inline classification

```javascript
const classify = (age) =>
  match(age)(
    [(x) => x >= 18, "Adult"],
    [(x) => x >= 13, "Teenager"],
    [_, "Child"]
  );

[12, 15, 20].map(classify);
// => ["Child", "Teenager", "Adult"]
```

## Advanced features

### Multiple captures

```javascript
match({ name: "Bob", age: 30, city: "Madrid" })(
  [{ name: "$n", age: "$a", city: "$c" }, (b) => `${b.n}, ${b.a}, ${b.c}`],
  [_, "N/A"]
);
// => "Bob, 30, Madrid"
```

### Nested objects

```javascript
match({ user: { profile: { role: "admin" } } })(
  [{ user: { profile: { role: "admin" } } }, "Admin"],
  [{ user: { profile: { role: "user"  } } }, "User"],
  [_, "No access"]
);
```

### Guards in properties

```javascript
match({ score: 85 })(
  [{ score: (s) => s >= 90 }, "Excellent"],
  [{ score: (s) => s >= 70 }, "Passed"],
  [{ score: (s) => s >= 60 }, "Sufficient"],
  [_, "Failed"]
);
// => "Passed"
```

### OR patterns

Match multiple values with `or()`:

```javascript
import { match, _, or } from "match-pro";

const getStatusType = (code) =>
  match(code)(
    [or(200, 201, 204),      "success"],
    [or(400, 401, 403, 404), "client error"],
    [or(500, 502, 503),      "server error"],
    [_, "unknown"]
  );

getStatusType(200); // "success"
getStatusType(404); // "client error"
getStatusType(500); // "server error"
```

`or()` works inside object patterns too:

```javascript
match({ role: userRole })(
  [{ role: or("admin", "owner") }, "full access"],
  [{ role: "user" },              "limited access"],
  [_, "no access"]
);
```

### Error helper: `throwError()`

Throw errors directly inside a match expression:

```javascript
import { match, _, throwError } from "match-pro";

const processRequest = (req) =>
  match(req)(
    [{ auth: null },    throwError("Authentication required")],
    [{ auth: "$token"}, (b) => handleRequest(b.token)],
    [_, throwError("Invalid request")]
  );
```

The error is only thrown if the pattern matches:

```javascript
try {
  match(user)(
    [{ role: "guest" }, throwError("Access denied")],
    [{ role: "admin" }, () => deleteDatabase()]
  );
} catch (err) {
  console.error(err.message); // "Access denied"
}
```

### Exhaustive matching

Force an error when no pattern matches and no wildcard is present:

```javascript
import { match, _ } from "match-pro";

const getStatus = (code) =>
  match(code).exhaustive()(
    [200, "OK"],
    [404, "Not Found"],
    [500, "Error"],
    [_, "Unknown"]
  );

// Without _ or a matching pattern, throws:
// Error: No match: 999
match(999).exhaustive()(
  [200, "OK"],
  [404, "Not Found"]
);
```

## API Reference

### `match(value)(...cases)` — array syntax

```javascript
match(value)(
  [pattern, handler],
  ...
)
```

Returns the result of the first matching handler, or `undefined` if no match.

### `match(value, ...flatCases)` — flat syntax

```javascript
match(value, pattern, handler, pattern, handler, ...)
```

Same semantics, inline form. Patterns and handlers alternate as arguments.

### `match(value).exhaustive()(...cases)`

Array syntax only. Throws `Error("No match: <value>")` when nothing matches and no wildcard `_` is present.

### Wildcard `_`

Matches any value. Use as a default/fallback case:

```javascript
import { match, _ } from "match-pro";

match(value)(
  [1, "one"],
  [_, "anything else"]
);
```

### Capture `"$variable"`

Extracts a value from an object pattern into `bindings`:

```javascript
match({ name: "Ana", age: 28 })(
  [{ name: "$n", age: "$a" }, (b) => `${b.n} is ${b.a}`],
  [_, "No match"]
);
// bindings: { n: "Ana", a: 28 }
```

### `or(...values)`

Matches if the value is equal (via `Object.is`) to any of the given values:

```javascript
import { match, or } from "match-pro";

match(statusCode)(
  [or(200, 201, 204), "success"],
  [or(400, 404),      "client error"],
  [_, "other"]
);
```

### `throwError(message)`

Returns a handler function that throws `Error(message)` when invoked:

```javascript
import { match, throwError } from "match-pro";

match(value)(
  [condition, throwError("Error message")],
  [_, "ok"]
);
```

## Comparison with switch/if-else

```javascript
// switch — verbose, imperative
let result;
switch (user.role) {
  case "admin": result = `Hello ${user.name}`; break;
  case "user":  result = "Regular user";       break;
  default:      result = "Guest";
}

// match — expressive, returns a value
const result = match(user)(
  [{ role: "admin", name: "$n" }, (b) => `Hello ${b.n}`],
  [{ role: "user" },              "Regular user"],
  [_, "Guest"]
);
```

## TypeScript

```typescript
import { match, _, Wildcard, Bindings, or, throwError } from "match-pro";

const result = match<User>(user)(
  [{ role: "admin" }, "Admin"],
  [{ role: "user"  }, "User"],
  [_, "Guest"]
) as string;

// OR patterns
const statusType = match<number>(code)(
  [or(200, 201, 204), "success"],
  [or(400, 404),      "client error"],
  [_, "unknown"]
) as string;

// Exhaustive mode
const status = match<number>(code).exhaustive()(
  [200, "OK"],
  [404, "Not Found"],
  [_, "Unknown"]
) as string;
```

## Why use match?

- More expressive than switch/if-else
- Real pattern matching with destructuring
- Immutable — returns values directly
- Type-safe with TypeScript
- Exhaustive checks
- OR patterns
- Error helpers
- < 1 KB minified · zero dependencies

## Performance

- Zero-copy: does not clone objects
- Lazy evaluation: stops at the first match

## Examples

See the `examples/` folder:

- `examples/typescript-example.ts` — TypeScript usage
- `examples/php-style-errors.js` — Error helpers
- `examples/real-world-examples.js` — 7 production patterns (Redux, state machines, routing, etc.)

## License

MIT © Juan Cristobal

Issues and PRs welcome on [GitHub](https://github.com/juancristobalgd1/match)
