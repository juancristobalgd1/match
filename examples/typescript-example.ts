/**
 * TypeScript Example - Demuestra type-safety completo
 *
 * Para ejecutar:
 *   npx tsx examples/typescript-example.ts
 */

import { match, _, Bindings, Wildcard } from "../src/match.js";

// ============================================
// TIPOS PERSONALIZADOS
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
const greeting: string = match(user)
  ({ role: "admin", name: "$n" }, (b: Bindings) => `👑 Hola ${b.n}`)
  ({ role: "user", name: "$n" }, (b: Bindings) => `👋 Hola ${b.n}`)
  (_, "👻 Invitado");

console.log("Greeting:", greeting);

// ============================================
// REDUX ACTIONS (Type-safe)
// ============================================

const handleAction = (action: Action): string => match(action)
  ({ type: "ADD_TODO", payload: { text: "$t" } }, (b: Bindings) =>
    `➕ Añadido: ${b.t}`)
  ({ type: "TOGGLE_TODO", payload: { id: "$id" } }, (b: Bindings) =>
    `🔄 Toggle #${b.id}`)
  ({ type: "DELETE_TODO", payload: { id: "$id" } }, (b: Bindings) =>
    `🗑️  Eliminado #${b.id}`)
  (_, "❓ Acción desconocida");

const action1: Action = { type: "ADD_TODO", payload: { text: "Aprender TS" } };
const action2: Action = { type: "TOGGLE_TODO", payload: { id: 42 } };

console.log("\nActions:");
console.log(handleAction(action1));
console.log(handleAction(action2));

// ============================================
// STATE MACHINE (Type-safe)
// ============================================

const nextState = (state: State, event: Event): State => match({ state, event })
  ({ state: "idle", event: "start" }, "loading" as State)
  ({ state: "loading", event: "success" }, "ready" as State)
  ({ state: "loading", event: "error" }, "error" as State)
  ({ state: "error", event: "retry" }, "loading" as State)
  ({ state: _, event: "reset" }, "idle" as State)
  (_, state);

console.log("\nState Machine:");
console.log("idle + start =>", nextState("idle", "start"));
console.log("loading + success =>", nextState("loading", "success"));
console.log("error + retry =>", nextState("error", "retry"));

// ============================================
// GUARDS CON TIPOS
// ============================================

const classify = (age: number): string => match(age)
  ((x: number) => x >= 18, "Mayor")
  ((x: number) => x >= 13, "Adolescente")
  (_, "Niño");

console.log("\nClasificación por edad:");
[12, 15, 20].forEach(age => {
  console.log(`  ${age} años => ${classify(age)}`);
});

// ============================================
// SINTAXIS CLÁSICA (También type-safe)
// ============================================

const classicSyntax: string = match(user)
  .when({ role: "admin" }, "Admin")
  .when({ role: "user" }, "User")
  .else("Guest");

console.log("\nSintaxis clásica:", classicSyntax);

// ============================================
// OBJETOS ANIDADOS
// ============================================

interface NestedData {
  user: {
    profile: {
      role: "admin" | "user";
      permissions: string[];
    };
  };
}

const data: NestedData = {
  user: {
    profile: {
      role: "admin",
      permissions: ["read", "write", "delete"]
    }
  }
};

const accessLevel: string = match(data)
  ({ user: { profile: { role: "admin" } } }, "🔐 Admin")
  ({ user: { profile: { role: "user" } } }, "👤 User")
  (_, "❌ Sin acceso");

console.log("\nNivel de acceso:", accessLevel);

// ============================================
// INLINE TYPE INFERENCE
// ============================================

// TypeScript infiere el tipo de retorno automáticamente
const numbers = [1, 2, 3, 4, 5];
const labels = numbers.map(n => match(n)
  (1, "one")
  (2, "two")
  (3, "three")
  (_, "other")
);

console.log("\nLabels:", labels);

console.log("\n✨ TypeScript example completado!");
