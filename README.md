# match

**The cleanest pattern matching syntax in pure JavaScript**

- ✨ **Clean syntax** - Rust/OCaml-inspired arrays
- 🎯 **Destructuring** with `$variable`
- 🔥 **Wildcards** `_` for any value
- 🎨 **OR patterns** - Match multiple values: `or(1, 2, 3)`
- 🛡️ **Type-safe** with TypeScript
- 📦 **< 1 KB** (883 bytes) · 0 dependencies
- ⚡ Optimal performance

## Installation

```bash
npm install match-pro
```

## 🚀 Ultra Clean Syntax

```javascript
import { match, _ } from "match-pro";

const user = { name: "Ana", role: "admin" };

// ✅ Clean array syntax - formatter-friendly!
const result = match(user)(
  [{ role: "admin", name: "$n" }, (b) => `👑 Hello boss ${b.n}!`],
  [{ role: "user", name: "$n" }, (b) => `👋 Hello ${b.n}`],
  [_, "👻 Guest"]
);

// => "👑 Hello boss Ana!"
```

## 🔥 PHP/Rust-style Features

```javascript
import { match, _, def } from "match-pro";

// ✨ Use 'def' keyword like PHP
const result = match(status)(
  ["success", 200],
  ["error", 500],
  [def, 400] // More expressive than _
);

// 🛡️ Exhaustive mode (like Rust/TypeScript)
match(value).exhaustive()(
  [1, "one"],
  [2, "two"]
);
// ❌ Throws error if no match and no default!

// ✅ Safe with default case
match(value).exhaustive()(
  [1, "one"],
  [2, "two"],
  [def, "other"]
); // No error
```

## Syntax

```javascript
match(value)(
  [pattern1, handler1],
  [pattern2, handler2],
  [_, default]
)
```

## Quick examples

### 1️⃣ Numbers

```javascript
match(2)(
  [1, "uno"],
  [2, "dos"],
  [3, "tres"],
  [_, "otro"]
);
// => "dos"
```

### 2️⃣ Destructuring

```javascript
const user = { name: "Ana", role: "admin", age: 28 };

match(user)(
  [{ name: "$name", role: "admin" }, (b) => `Hello boss ${b.name}`],
  [{ name: "$name" }, (b) => `Hello ${b.name}`],
  [_, "Anonymous"]
);
// => "Hello boss Ana"
```

### 3️⃣ Arrays/Tuples

```javascript
match([1, 999, 3])(
  [[1, _, 3], "First and last match"],
  [[_, 2, _], "Middle is 2"],
  [_, "Other"]
);
// => "First and last match"
```

### 4️⃣ Guards (predicates)

```javascript
match(17)(
  [(x) => x >= 18, "🔞 Adult"],
  [(x) => x >= 13, "👦 Teenager"],
  [_, "👶 Child"]
);
// => "👦 Teenager"
```

### 5️⃣ Redux Actions

```javascript
const action = {
  type: "ADD_TODO",
  payload: { text: "Aprender match" },
};

match(action)(
  [{ type: "ADD_TODO", payload: { text: "$t" } }, (b) => `➕ ${b.t}`],
  [{ type: "TOGGLE_TODO", payload: { id: "$id" } }, (b) => `🔄 #${b.id}`],
  [{ type: "DELETE_TODO", payload: { id: "$id" } }, (b) => `🗑️ #${b.id}`],
  [_, "❓ Unknown action"]
);
// => "➕ Aprender match"
```

## Real-world use cases

### State Machine

```javascript
const nextState = (state, event) =>
  match({ state, event })(
    [{ state: "idle", event: "start" }, "loading"],
    [{ state: "loading", event: "success" }, "ready"],
    [{ state: "loading", event: "error" }, "error"],
    [{ state: "error", event: "retry" }, "loading"],
    [{ state: _, event: "reset" }, "idle"],
    [_, state]
  );

nextState("idle", "start"); // => "loading"
```

### Form validation

```javascript
const validate = (form) =>
  match(form)(
    [{ email: "$e", password: "$p" }, (b) => validateLogin(b.e, b.p)],
    [{ email: "$e" }, () => "Password missing"],
    [_, "Incomplete data"]
  );
```

### Routing

```javascript
const route = (req) =>
  match(req)(
    [{ method: "GET", path: "/users" }, () => listUsers()],
    [{ method: "GET", path: "/users/$id" }, (b) => getUser(b.id)],
    [{ method: "POST", path: "/users" }, () => createUser()],
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
  [{ name: "$n", age: "$a", city: "$c" }, (b) => `${b.n}, ${b.a} years old, ${b.c}`],
  [_, "N/A"]
);
// => "Bob, 30 years old, Madrid"
```

### Nested objects

```javascript
match({ user: { profile: { role: "admin" } } })(
  [{ user: { profile: { role: "admin" } } }, "🔐 Admin"],
  [{ user: { profile: { role: "user" } } }, "👤 User"],
  [_, "❌ No access"]
);
// => "🔐 Admin"
```

### Wildcards in objects

```javascript
match({ role: "admin", perms: ["read", "write"] })(
  [{ role: "admin", perms: _ }, "Admin with permissions"],
  [{ role: "admin" }, "Admin without permissions"],
  [_, "Not admin"]
);
// => "Admin with permissions"
```

### Guards in properties

```javascript
match({ score: 85 })(
  [{ score: (s) => s >= 90 }, "🏆 Excellent"],
  [{ score: (s) => s >= 70 }, "✅ Passed"],
  [{ score: (s) => s >= 60 }, "⚠️ Sufficient"],
  [_, "❌ Failed"]
);
// => "✅ Passed"
```

### OR patterns

Match multiple values with the `or()` helper:

```javascript
import { match, _, or } from "match-pro";

// HTTP Status codes
const getStatusType = (code) =>
  match(code)(
    [or(200, 201, 204), "success"],
    [or(400, 401, 403, 404), "client error"],
    [or(500, 502, 503), "server error"],
    [_, "unknown"]
  );

getStatusType(200);  // "success"
getStatusType(404);  // "client error"
getStatusType(500);  // "server error"
```

Works with any type:

```javascript
// Strings
match("hello")(
  [or("hi", "hello", "hey"), "greeting"],
  [or("bye", "goodbye"), "farewell"],
  [_, "other"]
);

// In object patterns
match({ status: 404 })(
  [{ status: or(200, 201) }, "success"],
  [{ status: or(400, 404, 500) }, "error"],
  [_, "unknown"]
);
```

### Exhaustive matching

```javascript
import { match, def } from "match-pro";

// Force exhaustive checks (throws if no match)
const getStatus = (code) =>
  match(code).exhaustive()(
    [200, "OK"],
    [404, "Not Found"],
    [500, "Error"],
    [def, "Unknown"] // Required!
  );

// ❌ This would throw an error:
// match(999).exhaustive()([200, "OK"], [404, "Not Found"]);
// Error: No match: 999

// ✅ This is safe:
match(999).exhaustive()(
  [200, "OK"],
  [def, "Unknown"]
); // => "Unknown"
```

### Using DEFAULT symbol

```javascript
import { match, def } from "match-pro";

// Use 'def' for better readability (like PHP 8+)
const classify = (age) =>
  match(age)(
    [(x) => x >= 18, "Adult"],
    [(x) => x >= 13, "Teen"],
    [def, "Child"] // Same as _ but more expressive
  );

// Works in objects and arrays too
match({ role: "admin", perms: def })(
  [{ role: "admin", perms: def }, "Admin with any perms"],
  [def, "Other"]
);
```

## API Reference

### Syntax

```javascript
match(value)(
  [pattern, handler],
  [pattern, handler],
  [_, default]
)
```

**Pattern**: Can be:

- Primitive value: `1`, `"hello"`, `null`
- Object: `{ role: "admin" }`
- Array: `[1, _, 3]`
- Guard function: `x => x >= 18`
- OR pattern: `or(1, 2, 3)` - matches any of the values
- Wildcard: `_` or `def`

**Handler**: Can be:

- Direct value: `"result"`
- Function: `(bindings, value) => ...`

### Wildcard `_` and `def`

Special symbols that match any value.

```javascript
import { match, _, def } from "match-pro";

match([1, 999, 3])(
  [[1, _, 3], "match"], // _ matches 999
  [_, "default"] // _ matches everything
);

// def works exactly like _ but is more expressive
match(value)(
  [1, "one"],
  [2, "two"],
  [def, "other"]
);
```

### Capture `"$variable"`

Extracts values from the pattern.

```javascript
match({ name: "Ana", age: 28 })(
  [{ name: "$n", age: "$a" }, (b) => `${b.n} is ${b.a} years old`],
  [_, "No match"]
);
// Bindings: { n: "Ana", a: 28 }
```

### `or()` helper

Match multiple values with a single pattern.

```javascript
import { match, or } from "match-pro";

match(statusCode)(
  [or(200, 201, 204), "success"],
  [or(400, 404), "client error"],
  [or(500, 502, 503), "server error"],
  [_, "unknown"]
);

// Can be nested in objects
match({ role: userRole })(
  [{ role: or("admin", "owner") }, "full access"],
  [{ role: "user" }, "limited access"]
);
```

### `.exhaustive()` method

Enable exhaustive matching mode (throws error if no match and no default).

```javascript
import { match, def } from "match-pro";

// Throws if no match found
match(value).exhaustive()(
  [pattern1, handler1],
  [pattern2, handler2]
);
// Error: No match: <value>

// Safe with default case
match(value).exhaustive()(
  [pattern1, handler1],
  [def, defaultHandler]
); // OK
```

## Comparison with switch/if-else

### ❌ With switch (verbose)

```javascript
let result;
switch (user.role) {
  case "admin":
    result = `Hello ${user.name}`;
    break;
  case "user":
    result = "Regular user";
    break;
  default:
    result = "Guest";
}
```

### ✅ With match (elegant)

```javascript
const result = match(user)(
  [{ role: "admin", name: "$n" }, (b) => `Hello ${b.n}`],
  [{ role: "user" }, "Regular user"],
  [_, "Guest"]
);
```

## TypeScript

All types included:

```typescript
import { match, _, Wildcard, Bindings, def, or } from "match-pro";

const result: string = match<User>(user)(
  [{ role: "admin" }, "Admin"],
  [{ role: "user" }, "User"],
  [_, "Guest"]
) as string;

// With OR patterns
const statusType = match<number>(code)(
  [or(200, 201, 204), "success"],
  [or(400, 404), "client error"],
  [_, "unknown"]
) as string;

// With exhaustive mode
const status = match<number>(code).exhaustive()(
  [200, "OK"],
  [404, "Not Found"],
  [def, "Unknown"]
) as string;

// Type-safe pattern matching
type Status = "idle" | "loading" | "success" | "error";
const message: string = match<Status>(status)(
  ["idle", "Ready"],
  ["loading", "Please wait..."],
  [def, "Something happened"]
) as string;
```

## Why use match?

✅ **More expressive** than switch/if-else

✅ Real **pattern matching** with destructuring

✅ **Immutable** - returns values directly

✅ **Type-safe** with TypeScript

✅ **Exhaustive checks** - like Rust and PHP 8+

✅ **DEFAULT symbol** - more readable than `_`

✅ **OR patterns** - `or(1, 2, 3)` for multiple values

✅ **Tiny** - < 1 KB minified (883 bytes!)

✅ **Zero deps** - no dependencies

✅ **Formatter-friendly** - no chainable syntax issues

## Performance

- **Zero-copy**: does not clone objects
- **Lazy evaluation**: stops at the first match
- **Minimal overhead**: ~883 bytes minified

## Complete examples

Check out the `examples/` folder for TypeScript usage examples.

## License

MIT © Juan Cristobal

## Contribute

Issues and PRs welcome on [GitHub](https://github.com/juancristobalgd1/match)
