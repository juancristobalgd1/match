/**
 * TypeScript Example for match
 *
 * To execute:
 *   npx tsx examples/typescript-example.ts
 */
import { match, _, Bindings, Matcher } from "../src/match.js";

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
// SINTAXIS LIMPIA (Type-safe)
// ============================================

const user: User = { name: "Ana", role: "admin", age: 28 };

// ✅ El resultado es type-safe: string

const _greeting: Matcher<string> = match(user)(
  { role: "admin", name: "$n" },
  (b: Bindings) => `👑 Hola ${b.n}`
)({ role: "user", name: "$n" }, (b: Bindings) => `👋 Hola ${b.n}`)(
  _,
  "👻 Invitado"
);

// ============================================
// REDUX ACTIONS (Type-safe)
// ============================================

const _handleAction = (action: Action): string => {
  return match(action)(
    { type: "ADD_TODO", payload: { text: "$t" } },
    (b: Bindings) => `➕ Añadido: ${b.t}`
  )(
    { type: "TOGGLE_TODO", payload: { id: "$id" } },
    (b: Bindings) => `🔄 Toggle #${b.id}`
  )(
    { type: "DELETE_TODO", payload: { id: "$id" } },
    (b: Bindings) => `🗑️  Eliminado #${b.id}`
  )(_, " ❓ Acción desconocida") as unknown as string;
};

const _action1: Action = { type: "ADD_TODO", payload: { text: "Aprender TS" } };

const _action2: Action = { type: "TOGGLE_TODO", payload: { id: 42 } };

// ============================================

// STATE MACHINE (Type-safe)

// ============================================

const _nextState = (state: State, event: Event): State =>
  match({ state, event })(
    { state: "idle", event: "start" },
    "loading" as State
  )({ state: "loading", event: "success" }, "ready" as State)(
    { state: "loading", event: "error" },
    "error" as State
  )({ state: "error", event: "retry" }, "loading" as State)(
    { state: _, event: "reset" },
    "idle" as State
  )(_, state) as unknown as State;

// ============================================
// GUARDS CON TIPOS
// ============================================

const _classify = (age: number): string =>
  match(age)((x: number) => x >= 18, "Mayor")(
    (x: number) => x >= 13,
    "Adolescente"
  )(_, "Niño") as unknown as string;

// ============================================
// INLINE TYPE INFERENCE
// ============================================

// TypeScript infiere el tipo de retorno automáticamente

const numbers = [1, 2, 3, 4, 5];

const _labels = numbers.map((n) =>
  match(n)(1, "one")(2, "two")(3, "three")(_, "other")
);
