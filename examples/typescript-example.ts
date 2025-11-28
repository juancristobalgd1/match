/**
 * TypeScript Example for match
 *
 * To execute:
 *   npx tsx examples/typescript-example.ts
 */
import { match, _, Bindings, ExecuteMatch } from "../src/match.js";

// ============================================
// CUSTOMISED TYPES
// ============================================

interface User {
  name: string;
  role: "admin" | "user" | "guest";
  age: number;
}

type Action =
  | { type: "ADD_TODO"; payload: { text: string } }
  | { type: "TOGGLE_TODO"; payload: { id: number } }
  | { type: "DELETE_TODO"; payload: { id: number } };

type State = "idle" | "loading" | "ready" | "error";

type Event = "start" | "success" | "error" | "retry" | "reset";

// ============================================
// CLEAN SYNTAX (Type-safe)
// ============================================

const user: User = { name: "Ana", role: "admin", age: 28 };

// ✅ Type-safe result: string
const greeting: string = match(user)(
  [{ role: "admin", name: "$n" }, (b: Bindings) => `👑 Hola ${b.n}`],
  [{ role: "user", name: "$n" }, (b: Bindings) => `👋 Hola ${b.n}`],
  [_, "👻 Invitado"]
) as string;

console.log(greeting); // 👑 Hola Ana

// ============================================
// REDUX ACTIONS (Type-safe)
// ============================================

const handleAction = (action: Action): string => {
  return match(action)(
    [{ type: "ADD_TODO", payload: { text: "$t" } }, (b: Bindings) => `➕ Añadido: ${b.t}`],
    [{ type: "TOGGLE_TODO", payload: { id: "$id" } }, (b: Bindings) => `🔄 Toggle #${b.id}`],
    [{ type: "DELETE_TODO", payload: { id: "$id" } }, (b: Bindings) => `🗑️  Eliminado #${b.id}`],
    [_, "❓ Acción desconocida"]
  ) as string;
};

const action1: Action = { type: "ADD_TODO", payload: { text: "Aprender TS" } };
console.log(handleAction(action1)); // ➕ Añadido: Aprender TS

const action2: Action = { type: "TOGGLE_TODO", payload: { id: 42 } };
console.log(handleAction(action2)); // 🔄 Toggle #42

// ============================================
// STATE MACHINE (Type-safe)
// ============================================

const nextState = (state: State, event: Event): State =>
  match({ state, event })(
    [{ state: "idle", event: "start" }, "loading" as State],
    [{ state: "loading", event: "success" }, "ready" as State],
    [{ state: "loading", event: "error" }, "error" as State],
    [{ state: "error", event: "retry" }, "loading" as State],
    [{ state: _, event: "reset" }, "idle" as State],
    [_, state]
  ) as State;

console.log(nextState("idle", "start")); // loading
console.log(nextState("loading", "success")); // ready
console.log(nextState("error", "retry")); // loading

// ============================================
// GUARDS WITH TYPES
// ============================================

const classify = (age: number): string =>
  match(age)(
    [(x: number) => x >= 18, "Mayor"],
    [(x: number) => x >= 13, "Adolescente"],
    [_, "Niño"]
  ) as string;

console.log(classify(25)); // Mayor
console.log(classify(15)); // Adolescente
console.log(classify(8)); // Niño

// ============================================
// INLINE TYPE INFERENCE
// ============================================

// TypeScript infers the return type automatically
const numbers = [1, 2, 3, 4, 5];

const labels = numbers.map((n) =>
  match(n)(
    [1, "one"],
    [2, "two"],
    [3, "three"],
    [_, "other"]
  )
);

console.log(labels); // ["one", "two", "three", "other", "other"]

// ============================================
// EXHAUSTIVE MODE
// ============================================

const getHttpStatus = (code: number): string =>
  match(code).exhaustive()(
    [200, "OK"],
    [201, "Created"],
    [404, "Not Found"],
    [500, "Internal Server Error"],
    [_, "Unknown"]
  ) as string;

console.log(getHttpStatus(200)); // OK
console.log(getHttpStatus(999)); // Unknown

// ============================================
// COMPLEX OBJECT MATCHING
// ============================================

interface ApiResponse {
  status: number;
  data?: any;
  error?: string;
}

const handleResponse = (response: ApiResponse): string =>
  match(response)(
    [{ status: 200, data: "$d" }, (b: Bindings) => `Success: ${JSON.stringify(b.d)}`],
    [{ status: (s: number) => s >= 400 && s < 500 }, "Client error"],
    [{ status: (s: number) => s >= 500 }, "Server error"],
    [_, "Unknown response"]
  ) as string;

console.log(handleResponse({ status: 200, data: { id: 1 } })); // Success: {"id":1}
console.log(handleResponse({ status: 404 })); // Client error
console.log(handleResponse({ status: 500 })); // Server error
