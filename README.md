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
import { match, _, Wildcard, Bindings } from "match";

const result: string = match<User>(user)({ role: "admin" }, "Admin")(
  { role: "user" },
  "User"
)(_, "Guest");
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

```js
const user = { role: "admin", level: 5 };
match(user, [
  [{ role: "admin", level: (l) => l > 5 }, "Senior Admin"],
  [{ role: "admin" }, "Admin"],
  [{ role: "user", level: (l) => l > 3 }, "Advanced User"],
  ["default", "Regular User"],
]);

match(value, [
  { type: "user", name: "$nombre" }, (name) => `Hola ${name}`,
  { type: "admin" , () => "Admin"},
  {_, "Default"}
]);

match(value)({ type: "user", name: "$nombre" }, ({ name }) => `Hola ${name}`)(
  { type: "admin" },
  "Admin"
)(_, "Default");

// o

match(value)
  .with({ type: "user", name: P.string }, ({ name }) => `Hola ${name}`)
  .with({ type: "admin" }, () => "Admin")
  .otherwise(() => "Default");
```
