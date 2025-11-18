# match

**The match pattern in pure JavaScript**

# match

**The cleanest pattern matching syntax in pure JavaScript**

- ✨ **Clean syntax** match(args, fn)

- 🎯 **Destructuring** with `$variable`

- 🔥 **Wildcards** `_` for any value

- 🎨 **Rest patterns** `...$rest` for arrays

- 📝 **Regex support** for string matching

- 🔢 **Range matching** with `range()` helper

- 🔀 **OR patterns** `["a", "b", "c"]`

- 🛡️ **Type-safe** with TypeScript

- 📦 **~1.4 KB** minified · 0 dependencies

- ⚡ Optimal performance

## Installation

```bash

npm install match-pro

```

## 🚀 Ultra Clean Syntax (Recommended)

```javascript
import { match, _, range } from "match-pro";

const user = { name: "Ana", role: "admin" };

// ✅ Super clean - no .when()

const result = match(user)(
  { role: "admin", name: "$n" },
  (b) => `👑 Hello boss ${b.n}!`
)({ role: "user", name: "$n" }, (b) => `👋 Hello ${b.n}`)(_, "👻 Guest");

// => "👑 Hello boss Ana!"
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

## 🎨 Enhanced Features (NEW!)

### Rest Patterns (Array Spread)

Capture the rest of an array with `...$variable`:

```javascript
// Capture tail
match([1, 2, 3, 4])([1, "...$rest"], (b) => b.rest)(_, []);
// => [2, 3, 4]

// Capture middle
match([1, 2, 3, 4, 5])([1, "...$mid", 5], (b) => b.mid)(_, []);
// => [2, 3, 4]

// Capture head
match([1, 2, 3, 4])(["...$head", 4], (b) => b.head)(_, []);
// => [1, 2, 3]
```

### Regex Patterns

Match strings with regular expressions:

```javascript
match("test@gmail.com")(
  /^[\w.]+@gmail\.com$/,
  "Gmail user"
)(/^[\w.]+@.*\.edu$/, "Academic email")(_, "Other");
// => "Gmail user"

match("student@stanford.edu")(
  /^[\w.]+@gmail\.com$/,
  "Gmail"
)(/^[\w.]+@.*\.edu$/, "Academic")(_, "Other");
// => "Academic"
```

### Range Matching

Use the `range()` helper for numeric ranges:

```javascript
import { match, _, range } from "match-pro";

match(15)(range(0, 12), "Child")(range(13, 17), "Teenager")(
  range(18, 64),
  "Adult"
)(range(65, Infinity), "Senior")(_, "Unknown");
// => "Teenager"

// Classification pipeline
[10, 15, 25, 70]
  .map((age) =>
    match(age)(range(0, 12), "Child")(range(13, 17), "Teen")(
      range(18, 64),
      "Adult"
    )(_, "Senior")
  );
// => ["Child", "Teen", "Adult", "Senior"]
```

### OR Patterns

Match against multiple values with array patterns:

```javascript
match("admin")(
  ["admin", "superuser", "moderator"],
  "Admin access"
)(["user", "guest"], "Limited access")(_, "No access");
// => "Admin access"

match(2)([1, 2, 3], "Low")([4, 5, 6], "Medium")([7, 8, 9], "High")(
  _,
  "Other"
);
// => "Low"

// Works with null/undefined too
match(null)([null, undefined], "Empty")(_, "Has value");
// => "Empty"
```

### Combined Example

```javascript
const processInput = (input) =>
  match(input)(
    // Regex pattern
    /^\/help/, "Showing help..."
  )(
    // OR pattern
    ["quit", "exit", "q"],
    "Goodbye!"
  )(
    // Rest pattern
    ["echo", "...$args"],
    (b) => b.args.join(" ")
  )(
    // Range with guard
    range(1, 100),
    (n) => `Number: ${n}`
  )(_, "Unknown command");

processInput("/help"); // => "Showing help..."
processInput("quit"); // => "Goodbye!"
processInput(["echo", "Hello", "World"]); // => "Hello World"
processInput(42); // => "Number: 42"
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

- Array/Tuple: `[1, _, 3]`

- Rest pattern: `[1, "...$rest"]` (captures remaining elements)

- OR pattern: `["admin", "superuser"]` (matches any value in array)

- Regex: `/^test@/` (matches strings)

- Guard function: `x => x >= 18` or `range(18, 64)`

- Wildcard: `_`

**Handler**: Can be:

- Direct value: `"result"`

- Function: `(bindings, value) => ...`

### Wildcard `_`
Special symbol that matches any value.

```javascript
match([1, 999, 3])([1, _, 3], "match")(
  // _ matches 999

  _,
  "default"
); // _ matches everything
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

### Helper: `range(min, max)`

Creates a guard function for numeric range matching (inclusive).

```javascript
import { range } from "match-pro";

range(0, 10); // Returns: (value) => value >= 0 && value <= 10

// Usage
match(5)(range(0, 10), "in range")(_, "out of range");
// => "in range"
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
import { match, _, range, Wildcard, Bindings } from "match-pro";

const result: string = match<User>(user)({ role: "admin" }, "Admin")(
  { role: "user" },
  "User"
)(_, "Guest");

// With range helper
const ageGroup: string = match<number>(25)(
  range(0, 17), "Minor"
)(range(18, Infinity), "Adult")(_, "Unknown");
```
## Why use match?

✅ **More expressive** than switch/if-else

✅ Real **pattern matching** with destructuring

✅ **Immutable** - returns values directly

✅ **Type-safe** with TypeScript

✅ **Tiny** - < 1 KB minified

✅ **Zero deps** - no dependencies

✅ **Flexible** - two syntaxes available

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