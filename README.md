# match

**The match pattern in pure JavaScript**

# match

**The cleanest pattern matching syntax in pure JavaScript**

- ✨ **Clean syntax** match(args, fn)

- 🎯 **Destructuring** with `$variable`

- 🔥 **Wildcards** `_` for any value

- 🛡️ **Type-safe** with TypeScript

- 📦 **< 1 KB** · 0 dependencies

- ⚡ Optimal performance

## Installation

```bash

npm install match-pro

```

## 🚀 Ultra Clean Syntax (Recommended)

```javascript
import { match, _ } from "match-pro";

const user = { name: "Ana", role: "admin" };

// ✅ Super clean - no .when()

const result = match(user)(
  { role: "admin", name: "$n" },
  (b) => `👑 Hello boss ${b.n}!`
)({ role: "user", name: "$n" }, (b) => `👋 Hello ${b.n}`)(_, "👻 Guest");

// => "👑 Hello boss Ana!"
```

## 🔥 NEW: PHP/Rust-style Features

```javascript
import { match, _ } from "match-pro";
import def from "match-pro"; // DEFAULT symbol (alias for _)

// ✨ Use 'default' keyword like PHP
const result = match(status)
  ("success", 200)
  ("error", 500)
  (def, 400); // More expressive than _

// 🛡️ Exhaustive mode (like Rust/TypeScript)
match(value).exhaustive()
  (1, "one")
  (2, "two");
  // ❌ Throws error if no match and no default!

// ✅ Safe with default case
match(value).exhaustive()
  (1, "one")
  (2, "two")
  (def, "other"); // No error
```

## Syntax comparison

### Syntax

```javascript

match(value)

  (pattern1, handler1)

  (pattern2, handler2)

  (_, default)

```

## Quick examples

### 1️⃣ Numbers

```javascript
match(2)(1, "uno")(2, "dos")(3, "tres")(_, "otro");

// => "dos"
```

### 2️⃣ Destructuring

```javascript
const user = { name: "Ana", role: "admin", age: 28 };

match(user)({ name: "$name", role: "admin" }, (b) => `Hello boss ${b.name}`)(
  { name: "$name" },
  (b) => `Hello ${b.name}`
)(_, "Anonymous");

// => "Hello boss Ana"
```

### 3️⃣ Arrays/Tuples

```javascript
match([1, 999, 3])([1, _, 3], "First and last match")([_, 2, _], "Middle is 2")(
  _,
  "Other"
);

// => "First and last match"
```

### 4️⃣ Guards (predicates)

```javascript
match(17)((x) => x >= 18, "🔞 Adult")((x) => x >= 13, "👦 Teenager")(
  _,
  "👶 Child"
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
  { type: "ADD_TODO", payload: { text: "$t" } },
  (b) => `➕ ${b.t}`
)({ type: "TOGGLE_TODO", payload: { id: "$id" } }, (b) => `🔄 #${b.id}`)(
  { type: "DELETE_TODO", payload: { id: "$id" } },
  (b) => `🗑️  #${b.id}`
)(_, "❓ Acción desconocida");

// => "➕ Aprender match"
```

## Real-world use cases

### State Machine

```javascript
const nextState = (state, event) =>
  match({ state, event })({ state: "idle", event: "start" }, "loading")(
    { state: "loading", event: "success" },
    "ready"
  )({ state: "loading", event: "error" }, "error")(
    { state: "error", event: "retry" },
    "loading"
  )({ state: _, event: "reset" }, "idle")(_, state);

nextState("idle", "start"); // => "loading"
```

### Form validation

```javascript
const validate = (form) =>
  match(form)({ email: "$e", password: "$p" }, (b) => validateLogin(b.e, b.p))(
    { email: "$e" },
    () => "Password missing"
  )(_, "Incomplete data");
```

### Routing

```javascript
const route = (req) =>
  match(req)({ method: "GET", path: "/users" }, () => listUsers())(
    { method: "GET", path: "/users/$id" },
    (b) => getUser(b.id)
  )({ method: "POST", path: "/users" }, () => createUser())(_, () =>
    notFound()
  );
```

### Inline classification

````javascript
const classify = (age) =>
  match(age)((x) => x >= 18, "Adult")((x) => x >= 13, "Teenager")(
    _,
    "Child"
  );

[12, 15, 20].map(classify);

// => ["Child", "Teenager", "Adult"]
```## Advanced features

### Multiple captures

```javascript
match({ name: "Bob", age: 30, city: "Madrid" })(
  { name: "$n", age: "$a", city: "$c" },

  (b) => `${b.n}, ${b.a} years old, ${b.c}`
)(_, "N/A");

// => "Bob, 30 years old, Madrid"
````

### Nested objects

```javascript
match({ user: { profile: { role: "admin" } } })(
  { user: { profile: { role: "admin" } } },
  "🔐 Admin"
)({ user: { profile: { role: "user" } } }, "👤 User")(_, "❌ No access");

// => "🔐 Admin"
```

### Wildcards in objects

```javascript
match({ role: "admin", perms: ["read", "write"] })(
  { role: "admin", perms: _ },
  "Admin with permissions"
)({ role: "admin" }, "Admin without permissions")(_, "Not admin");

// => "Admin with permissions"
```

### Guards in properties

```javascript
match({ score: 85 })({ score: (s) => s >= 90 }, "🏆 Excellent")(
  { score: (s) => s >= 70 },
  "✅ Passed"
)({ score: (s) => s >= 60 }, "⚠️  Sufficient")(_, "❌ Failed");

// => "✅ Passed"
```

### Exhaustive matching (NEW)

```javascript
import def from "match-pro";

// Force exhaustive checks (throws if no match)
const getStatus = (code) =>
  match(code).exhaustive()
    (200, "OK")
    (404, "Not Found")
    (500, "Error")
    (def, "Unknown"); // Required!

// ❌ This would throw an error:
// match(999).exhaustive()(200, "OK")(404, "Not Found");
// Error: No match: 999

// ✅ This is safe:
match(999).exhaustive()(200, "OK")(def, "Unknown"); // => "Unknown"
```

### Using DEFAULT symbol

```javascript
import def from "match-pro";

// Use 'default' for better readability (like PHP 8+)
const classify = (age) =>
  match(age)
    ((x) => x >= 18, "Adult")
    ((x) => x >= 13, "Teen")
    (def, "Child"); // Same as _ but more expressive

// Works in objects and arrays too
match({ role: "admin", perms: def })(
  { role: "admin", perms: def },
  "Admin with any perms"
)(def, "Other");
```

## API Reference

### Clean syntax

```javascript

match(value)

  (pattern, handler)

  (pattern, handler)

  (_, default)  // ← Always end with wildcard

```

**Pattern**: Can be:

- Primitive value: `1`, `"hello"`, `null`

- Object: `{ role: "admin" }`

- Array: `[1, _, 3]`

- Guard function: `x => x >= 18`

- Wildcard: `_`

**Handler**: Can be:

- Direct value: `"result"`

- Function: `(bindings, value) => ...`

### Wildcard `_` and DEFAULT

Special symbols that match any value.

```javascript
import { match, _ } from "match-pro";
import def from "match-pro"; // DEFAULT symbol

match([1, 999, 3])([1, _, 3], "match")(
  // _ matches 999

  _,
  "default"
); // _ matches everything

// DEFAULT works exactly like _ but is more expressive
match(value)(1, "one")(2, "two")(def, "other");
```

### Capture `"$variable"`

Extracts values from the pattern.

```javascript
match({ name: "Ana", age: 28 })(
  { name: "$n", age: "$a" },
  (b) => `${b.n} is ${b.a} years old`
)(_, "No match");

// Bindings: { n: "Ana", a: 28 }
```

### `.exhaustive()` method (NEW)

Enable exhaustive matching mode (throws error if no match and no default).

```javascript
import def from "match-pro";

// Throws if no match found
match(value).exhaustive()
  (pattern1, handler1)
  (pattern2, handler2);
  // Error: No match: <value>

// Safe with default case
match(value).exhaustive()
  (pattern1, handler1)
  (def, defaultHandler); // OK

// Can be chained anywhere before patterns
const result = match(42).exhaustive()(1, "one")(def, "other");
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
const result = match(user)({ role: "admin", name: "$n" }, (b) => `Hola ${b.n}`)(
  { role: "user" },
  "Regular user"
)(_, "Guest");
```

## TypeScript

All types included:

```typescript
import { match, _, Wildcard, Bindings, Default } from "match-pro";
import def from "match-pro";

const result: string = match<User>(user)({ role: "admin" }, "Admin")(
  { role: "user" },
  "User"
)(_, "Guest");

// With exhaustive mode
const status = match<number>(code)
  .exhaustive()
  (200, "OK")
  (404, "Not Found")
  (def, "Unknown");

// Type-safe pattern matching
type Status = "idle" | "loading" | "success" | "error";
const message: string = match<Status>(status)
  ("idle", "Ready")
  ("loading", "Please wait...")
  (def, "Something happened");
```

## Why use match?

✅ **More expressive** than switch/if-else

✅ Real **pattern matching** with destructuring

✅ **Immutable** - returns values directly

✅ **Type-safe** with TypeScript

✅ **Exhaustive checks** - like Rust and PHP 8+

✅ **DEFAULT symbol** - more readable than `_`

✅ **Tiny** - < 1 KB minified (1009 bytes!)

✅ **Zero deps** - no dependencies

✅ **Flexible** - multiple ways to express patterns

## Performance

- **Zero-copy**: does not clone objects

- **Lazy evaluation**: stops at the first match

- **Minimal overhead**: ~800 bytes minified + gzip

## Complete examples

Check out the `examples/` folder to see:

- `clean-syntax.js` - Complete clean syntax

- `showcase.js` - All use cases

- `todo-app.js` - Real app using match

## Licence

MIT © Juan Cristobal

## Contribute

Issues and PRs welcome on [GitHub](https://github.com/juancristobalgd1/match)
