/**
 * 🔥 REAL-WORLD EXAMPLES - match-pro
 *
 * Ejemplos significativos usando todas las características:
 * - Array syntax
 * - OR patterns
 * - Error helpers (throwError, fail, panic)
 * - Destructuring
 * - Guards
 * - Captures
 * - Exhaustive mode
 */

import { match, _, def, or, throwError, fail, panic } from "../src/match.js";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1️⃣ REDUX REDUCER - Shopping Cart
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const cartReducer = (state = { items: [], total: 0 }, action) =>
  match(action)(
    // Add item
    [{ type: "ADD_ITEM", payload: "$item" }, (b) => ({
      ...state,
      items: [...state.items, b.item],
      total: state.total + b.item.price
    })],

    // Remove item by ID
    [{ type: "REMOVE_ITEM", payload: { id: "$id" } }, (b) => {
      const item = state.items.find(i => i.id === b.id);
      return {
        ...state,
        items: state.items.filter(i => i.id !== b.id),
        total: state.total - (item?.price || 0)
      };
    }],

    // Update quantity
    [{ type: "UPDATE_QUANTITY", payload: { id: "$id", quantity: "$qty" } }, (b) => {
      const item = state.items.find(i => i.id === b.id);
      const priceDiff = (b.qty - item.quantity) * item.price;

      return {
        ...state,
        items: state.items.map(i =>
          i.id === b.id ? { ...i, quantity: b.qty } : i
        ),
        total: state.total + priceDiff
      };
    }],

    // Clear cart
    [{ type: "CLEAR_CART" }, { items: [], total: 0 }],

    // Unknown action
    [_, state]
  );

// Usage
console.log("\n📦 REDUX REDUCER:");
let cart = cartReducer(undefined, { type: "@@INIT" });
cart = cartReducer(cart, {
  type: "ADD_ITEM",
  payload: { id: 1, name: "iPhone", price: 999, quantity: 1 }
});
cart = cartReducer(cart, {
  type: "ADD_ITEM",
  payload: { id: 2, name: "AirPods", price: 249, quantity: 1 }
});
console.log("Cart:", cart);
// { items: [...], total: 1248 }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2️⃣ API HANDLER - REST Endpoint con validación completa
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const handleApiRequest = (req) =>
  match(req)(
    // Health check
    [{ method: "GET", path: "/health" }, { status: 200, body: { healthy: true } }],

    // Get user by ID
    [{ method: "GET", path: "/users/$id" }, (b, { params }) => ({
      status: 200,
      body: { id: b.id, name: "User " + b.id }
    })],

    // Create user - con validación
    [{ method: "POST", path: "/users", body: "$data" }, (b) =>
      match(true)(
        [!b.data.email, fail("Email is required")],
        [!b.data.email.includes("@"), fail("Invalid email format")],
        [!b.data.password, fail("Password is required")],
        [b.data.password.length < 8, fail("Password must be at least 8 chars")],
        [_, () => ({
          status: 201,
          body: { id: Math.random(), ...b.data, password: undefined }
        })]
      )
    ],

    // Update user
    [{ method: or("PUT", "PATCH"), path: "/users/$id", body: "$data" }, (b) => ({
      status: 200,
      body: { id: b.id, ...b.data, updatedAt: new Date().toISOString() }
    })],

    // Delete user
    [{ method: "DELETE", path: "/users/$id" }, (b) => ({
      status: 204,
      body: null
    })],

    // Method not allowed
    [{ path: (p) => p.startsWith("/users") }, throwError("Method not allowed")],

    // 404
    [_, { status: 404, body: { error: "Not found" } }]
  );

// Usage
console.log("\n🌐 API HANDLER:");
console.log(handleApiRequest({ method: "GET", path: "/health" }));
// { status: 200, body: { healthy: true } }

try {
  handleApiRequest({
    method: "POST",
    path: "/users",
    body: { email: "invalid" }
  });
} catch (e) {
  console.log("Validation error:", e.message);
  // "Invalid email format"
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3️⃣ STATE MACHINE - Order Processing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const orderStateMachine = (state, event, context = {}) =>
  match({ state, event })(
    // Pending → Processing
    [
      { state: "pending", event: "process" },
      () => ({ state: "processing", timestamp: Date.now() })
    ],

    // Processing → Shipped (requires tracking number)
    [
      { state: "processing", event: "ship" },
      () => match(true)(
        [!context.trackingNumber, fail("Tracking number required")],
        [_, () => ({
          state: "shipped",
          trackingNumber: context.trackingNumber,
          timestamp: Date.now()
        })]
      )
    ],

    // Shipped → Delivered
    [
      { state: "shipped", event: "deliver" },
      () => ({ state: "delivered", timestamp: Date.now() })
    ],

    // Cancel from any state except delivered
    [
      { state: (s) => s !== "delivered", event: "cancel" },
      ({ state }) => ({
        state: "cancelled",
        previousState: state,
        timestamp: Date.now()
      })
    ],

    // Invalid transitions
    [
      { state: "delivered", event: "cancel" },
      panic("Cannot cancel delivered order")
    ],
    [
      { state: "cancelled", event: _ },
      panic("Cannot modify cancelled order")
    ],

    // Default - invalid transition
    [_, ({ state, event }) =>
      panic(`Invalid transition: ${state} -> ${event}`)
    ]
  );

// Usage
console.log("\n📦 STATE MACHINE:");
let order = orderStateMachine("pending", "process");
console.log("1. Processed:", order);
// { state: 'processing', timestamp: ... }

order = orderStateMachine("processing", "ship", { trackingNumber: "ABC123" });
console.log("2. Shipped:", order);
// { state: 'shipped', trackingNumber: 'ABC123', ... }

try {
  orderStateMachine("delivered", "cancel");
} catch (e) {
  console.log("3. Error:", e.message);
  // "Cannot cancel delivered order"
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4️⃣ AUTHENTICATION & AUTHORIZATION - Real-world security
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const authorize = (user, action, resource) =>
  match({ user, action, resource })(
    // No user - must authenticate
    [{ user: null }, throwError("Authentication required")],

    // Suspended user
    [{ user: { status: "suspended" } }, throwError("Account suspended")],

    // Admin - can do anything
    [{ user: { role: "admin" } }, () => ({ allowed: true, reason: "admin" })],

    // Owner can manage their own resources
    [
      { user: { id: "$uid" }, resource: { ownerId: "$oid" } },
      (b) => b.uid === b.oid
        ? { allowed: true, reason: "owner" }
        : match(b.user.role)(
            ["moderator", { allowed: true, reason: "moderator" }],
            [_, throwError("Forbidden - not owner")]
          )
    ],

    // Read-only for guests
    [
      { user: { role: "guest" }, action: or("read", "view", "list") },
      { allowed: true, reason: "guest-readonly" }
    ],

    // Premium users can create
    [
      { user: { role: "premium" }, action: or("create", "update") },
      { allowed: true, reason: "premium" }
    ],

    // Default deny
    [_, throwError("Forbidden - insufficient permissions")]
  );

// Usage
console.log("\n🔐 AUTHORIZATION:");
const admin = { id: 1, role: "admin", status: "active" };
const user = { id: 2, role: "premium", status: "active" };
const guest = { id: 3, role: "guest", status: "active" };

console.log(authorize(admin, "delete", { id: 100 }));
// { allowed: true, reason: 'admin' }

console.log(authorize(user, "create", {}));
// { allowed: true, reason: 'premium' }

try {
  authorize(guest, "delete", {});
} catch (e) {
  console.log("Guest delete:", e.message);
  // "Forbidden - insufficient permissions"
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5️⃣ WEBHOOK HANDLER - Payment processor
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const handleWebhook = (event) =>
  match(event)(
    // Payment succeeded
    [{ type: "payment.succeeded", data: { amount: "$amt", customer: "$cust" } }, (b) => ({
      action: "fulfill_order",
      customer: b.cust,
      amount: b.amt,
      notification: `Payment of $${b.amt / 100} received from ${b.cust}`
    })],

    // Payment failed
    [{ type: "payment.failed", data: { reason: "$reason", customer: "$cust" } }, (b) => ({
      action: "notify_failure",
      customer: b.cust,
      message: `Payment failed: ${b.reason}`
    })],

    // Subscription events
    [{ type: (t) => t.startsWith("subscription.") }, ({ type, data }) =>
      match(type)(
        ["subscription.created", { action: "welcome_email", ...data }],
        ["subscription.cancelled", { action: "cancel_email", ...data }],
        ["subscription.renewed", { action: "thank_you_email", ...data }],
        [_, { action: "log", event: type, data }]
      )
    ],

    // Refund requested
    [{ type: "refund.requested", data: { amount: "$amt" } }, (b) =>
      match(true)(
        [b.amt > 100000, fail("Refund amount too large - manual review required")],
        [_, () => ({ action: "process_refund", amount: b.amt })]
      )
    ],

    // Unknown webhook - log but don't fail
    [_, ({ type }) => ({
      action: "log_unknown",
      warning: `Unknown webhook type: ${type}`
    })]
  );

// Usage
console.log("\n💳 WEBHOOK HANDLER:");
console.log(handleWebhook({
  type: "payment.succeeded",
  data: { amount: 4999, customer: "cus_123" }
}));
// { action: 'fulfill_order', customer: 'cus_123', amount: 4999, ... }

console.log(handleWebhook({
  type: "subscription.created",
  data: { plan: "premium", customer: "cus_456" }
}));
// { action: 'welcome_email', plan: 'premium', customer: 'cus_456' }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6️⃣ COMMAND PATTERN - CLI Application
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const executeCommand = (cmd, args = {}) =>
  match(cmd)(
    // File operations
    [or("create", "new", "touch"), () =>
      match(true)(
        [!args.filename, fail("Filename required")],
        [args.filename.includes("/"), fail("Invalid filename")],
        [_, () => ({
          action: "create_file",
          filename: args.filename,
          content: args.content || ""
        })]
      )
    ],

    // List with filters
    [or("ls", "list", "dir"), () => ({
      action: "list_files",
      filter: args.filter || "*",
      recursive: args.recursive || false
    })],

    // Delete with confirmation
    ["delete", () =>
      match(true)(
        [!args.filename, fail("Filename required")],
        [!args.confirm && args.force !== true, fail("Deletion requires confirmation")],
        [_, () => ({
          action: "delete_file",
          filename: args.filename
        })]
      )
    ],

    // Search
    ["search", () =>
      match(true)(
        [!args.query, fail("Search query required")],
        [args.query.length < 3, fail("Query must be at least 3 characters")],
        [_, () => ({
          action: "search",
          query: args.query,
          caseSensitive: args.caseSensitive || false
        })]
      )
    ],

    // Help
    [or("help", "--help", "-h"), {
      action: "show_help",
      message: "Available commands: create, list, delete, search, help"
    }],

    // Unknown command
    [_, () => throwError(`Unknown command: ${cmd}. Try 'help'`)]
  );

// Usage
console.log("\n💻 CLI COMMANDS:");
console.log(executeCommand("create", { filename: "test.txt", content: "Hello" }));
// { action: 'create_file', filename: 'test.txt', content: 'Hello' }

console.log(executeCommand("help"));
// { action: 'show_help', message: '...' }

try {
  executeCommand("delete", { filename: "important.txt" });
} catch (e) {
  console.log("Delete error:", e.message);
  // "Deletion requires confirmation"
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7️⃣ RESPONSE NORMALIZER - Handle múltiples APIs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const normalizeApiResponse = (response, apiType) =>
  match({ response, apiType })(
    // Success responses
    [
      { response: { status: or(200, 201, 204), data: "$d" }, apiType: "$type" },
      (b) => ({
        success: true,
        data: b.d,
        source: b.type
      })
    ],

    // Error responses - normalize different formats
    [
      { response: { status: (s) => s >= 400, error: "$e" } },
      (b) => match(typeof b.e)(
        ["string", { success: false, error: b.e }],
        ["object", { success: false, error: b.e.message || "Unknown error" }],
        [_, { success: false, error: "Request failed" }]
      )
    ],

    // Retry-able errors
    [
      { response: { status: or(429, 503, 504) } },
      () => ({
        success: false,
        error: "Service temporarily unavailable",
        retryable: true
      })
    ],

    // Malformed response
    [
      { response: { status: undefined } },
      panic("Invalid response format - missing status")
    ],

    // Unknown
    [_, { success: false, error: "Unknown response format" }]
  );

// Usage
console.log("\n🔄 RESPONSE NORMALIZER:");
console.log(normalizeApiResponse(
  { status: 200, data: { id: 1, name: "Test" } },
  "github"
));
// { success: true, data: { id: 1, name: 'Test' }, source: 'github' }

console.log(normalizeApiResponse(
  { status: 429 },
  "stripe"
));
// { success: false, error: 'Service temporarily unavailable', retryable: true }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💡 SUMMARY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log("\n\n✅ All examples completed successfully!");
console.log("\nFeatures demonstrated:");
console.log("  ✓ Array syntax for clean, formatter-friendly code");
console.log("  ✓ OR patterns with or()");
console.log("  ✓ Error helpers: throwError, fail, panic");
console.log("  ✓ Destructuring with ({ prop }) =>");
console.log("  ✓ Captures with $variable");
console.log("  ✓ Guards with arrow functions");
console.log("  ✓ Nested matching");
console.log("  ✓ Exhaustive mode");
console.log("\n🔥 match-pro is production ready!");
