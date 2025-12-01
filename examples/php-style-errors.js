// PHP-style Error Throwing Example
// Inspired by PHP 8.0+ match expressions

import { match, _, throwError } from "match-pro";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 EXAMPLE 1: Redirector (like your PHP example)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class Router {
  constructor() {
    this.cyclic = 0;
  }

  reload() {
    return { action: "reload" };
  }

  setHeader(name, value) {
    return { action: "redirect", header: name, value };
  }

  redirector(page = null, maxRedirects = 10) {
    const isValidURL = (url) => /^https?:\/\/.+/.test(url);

    return match(true)(
      [page === null, () => this.reload()],
      [
        !isValidURL(page),
        throwError("The URL provided is invalid."),
      ],
      [
        ++this.cyclic > maxRedirects,
        throwError(
          "Cyclic routing has been detected. This may cause stability problems."
        ),
      ],
      [_, () => this.setHeader("Location", page)]
    );
  }
}

// Usage
const router = new Router();

console.log(router.redirector("https://example.com"));
// { action: 'redirect', header: 'Location', value: 'https://example.com' }

console.log(router.redirector(null));
// { action: 'reload' }

try {
  router.redirector("not-a-url");
} catch (e) {
  console.error(e.message); // "The URL provided is invalid."
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 EXAMPLE 2: Form Validation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const validateUser = (data) =>
  match(true)(
    [!data.email, throwError("Email is required")],
    [!data.email.includes("@"), throwError("Invalid email format")],
    [!data.password, throwError("Password is required")],
    [data.password.length < 8, throwError("Password must be at least 8 characters")],
    [data.age && data.age < 18, throwError("Must be 18 or older")],
    [_, () => ({ valid: true, data })]
  );

// Valid user
console.log(validateUser({ email: "user@example.com", password: "secret123", age: 25 }));
// { valid: true, data: { ... } }

// Invalid cases
try {
  validateUser({ password: "secret123" });
} catch (e) {
  console.error(e.message); // "Email is required"
}

try {
  validateUser({ email: "invalid", password: "secret123" });
} catch (e) {
  console.error(e.message); // "Invalid email format"
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 EXAMPLE 3: HTTP Status Handler
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { or, fail } from "match-pro";

const handleResponse = (response) =>
  match(response.status)(
    [or(200, 201, 204), () => ({ success: true, data: response.data })],
    [401, fail("Unauthorized - please login")],
    [403, fail("Forbidden - you don't have permission")],
    [404, fail("Resource not found")],
    [(s) => s >= 500, fail("Server error - please try again later")],
    [_, fail("Unexpected response status")]
  );

// Success case
console.log(handleResponse({ status: 200, data: { id: 1 } }));
// { success: true, data: { id: 1 } }

// Error cases throw immediately
try {
  handleResponse({ status: 404 });
} catch (e) {
  console.error(e.message); // "Resource not found"
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 EXAMPLE 4: State Machine with Error States
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { panic } from "match-pro";

const transition = (state, event) =>
  match({ state, event })(
    [{ state: "idle", event: "start" }, "loading"],
    [{ state: "loading", event: "success" }, "ready"],
    [{ state: "loading", event: "error" }, "error"],
    [{ state: "error", event: "retry" }, "loading"],
    [{ state: "ready", event: "reset" }, "idle"],

    // Invalid transitions panic (like Rust)
    [
      { state: "ready", event: "start" },
      panic("Cannot start from ready state"),
    ],
    [
      { state: "loading", event: "start" },
      panic("Already loading"),
    ],
    [_, panic(`Invalid transition: ${state} -> ${event}`)]
  );

console.log(transition("idle", "start")); // "loading"
console.log(transition("loading", "success")); // "ready"

try {
  transition("ready", "start");
} catch (e) {
  console.error(e.message); // "Cannot start from ready state"
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 EXAMPLE 5: Type Validation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const assertType = (value, expectedType) =>
  match(typeof value)(
    [expectedType, value],
    [_, throwError(`Expected ${expectedType}, got ${typeof value}`)]
  );

const processNumber = (x) => {
  const num = assertType(x, "number");
  return num * 2;
};

console.log(processNumber(5)); // 10

try {
  processNumber("5");
} catch (e) {
  console.error(e.message); // "Expected number, got string"
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💡 KEY BENEFITS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/*
1. Clean error handling like PHP 8.0+
2. Errors are part of the match flow
3. Three helpers available:
   - throwError() - General purpose
   - fail()       - For validation failures
   - panic()      - For impossible states (Rust-style)
4. Explicit and declarative
5. Better than try/catch in many cases
*/
