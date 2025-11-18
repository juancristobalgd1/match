/**
 * Showcase - Demostración de todas las capacidades de match()
 */

import { match, _ } from "../src/match.js";

console.log("✨ SHOWCASE - Pattern Matching Library\n");
console.log("=".repeat(50));

// ========== 1. BÁSICO ==========
console.log("\n📌 1. MATCHING BÁSICO");
console.log("-".repeat(50));

const numero = 2;
const resultado1 = match(numero)
  .when(1, "uno")
  .when(2, "dos")
  .when(3, "tres")
  .else("otro");

console.log(`match(${numero}) => "${resultado1}"`);

// ========== 2. WILDCARD ==========
console.log("\n📌 2. WILDCARD (_)");
console.log("-".repeat(50));

const cualquiera = 999;
const resultado2 = match(cualquiera)
  .when(1, "es uno")
  .when(2, "es dos")
  .when(_, "¡Match con cualquier cosa!")
  .else("nunca llega aquí");

console.log(`match(${cualquiera}) con wildcard => "${resultado2}"`);

// ========== 3. OBJETOS PARCIALES ==========
console.log("\n📌 3. MATCHING DE OBJETOS (parcial)");
console.log("-".repeat(50));

const user = { name: "Ana", role: "admin", age: 28, country: "ES" };
console.log("Usuario:", JSON.stringify(user));

const resultado3 = match(user)
  .when({ role: "admin" }, "✅ Acceso de administrador")
  .when({ role: "user" }, "👤 Usuario normal")
  .else("❌ Sin acceso");

console.log(`Resultado: ${resultado3}`);

// ========== 4. DESTRUCTURING CON $variable ==========
console.log("\n📌 4. DESTRUCTURING con $variable");
console.log("-".repeat(50));

const resultado4 = match(user)
  .when({ name: "$nombre", role: "admin" }, (b) =>
    `👑 Hola jefe ${b.nombre}! Tienes control total.`)
  .when({ name: "$nombre", age: "$edad" }, (b) =>
    `👋 Hola ${b.nombre}, tienes ${b.edad} años`)
  .else("👻 Usuario anónimo");

console.log(resultado4);

// ========== 5. ARRAYS/TUPLAS ==========
console.log("\n📌 5. ARRAYS Y TUPLAS");
console.log("-".repeat(50));

const tupla1 = [1, 999, 3];
const tupla2 = [5, 10, 15];

console.log(`match([1, 999, 3]):`);
const resultado5a = match(tupla1)
  .when([1, _, 3], "✅ Primero=1 y Último=3")
  .when([_, 2, _], "Medio es 2")
  .else("Otra combinación");
console.log(`  => ${resultado5a}`);

console.log(`\nmatch([5, 10, 15]):`);
const resultado5b = match(tupla2)
  .when([1, _, 3], "Primero=1 y Último=3")
  .when([5, _, 15], "✅ Primero=5 y Último=15")
  .else("Otra combinación");
console.log(`  => ${resultado5b}`);

// ========== 6. GUARDS (funciones) ==========
console.log("\n📌 6. GUARDS (predicados con funciones)");
console.log("-".repeat(50));

const edad1 = 17;
const edad2 = 25;

const clasificar = (edad) => match(edad)
  .when((x) => x >= 18, "🔞 Mayor de edad")
  .when((x) => x >= 13, "👦 Adolescente")
  .else("👶 Niño");

console.log(`match(${edad1}) => ${clasificar(edad1)}`);
console.log(`match(${edad2}) => ${clasificar(edad2)}`);

// ========== 7. DESTRUCTURING + LÓGICA ==========
console.log("\n📌 7. DESTRUCTURING + LÓGICA COMBINADA");
console.log("-".repeat(50));

const persona1 = { age: 17, country: "ES" };
const persona2 = { age: 25, country: "ES" };

const validar = (p) => match(p)
  .when({ age: "$edad", country: "ES" }, (b) =>
    b.edad >= 18 ? "✅ Mayor de edad en España" : "❌ Menor de edad en España")
  .when({ age: "$edad" }, (b) =>
    `👤 ${b.edad} años (extranjero)`)
  .else("Sin datos");

console.log("Persona 1:", JSON.stringify(persona1));
console.log(`  => ${validar(persona1)}`);
console.log("\nPersona 2:", JSON.stringify(persona2));
console.log(`  => ${validar(persona2)}`);

// ========== 8. REDUX/ACTIONS ==========
console.log("\n📌 8. REDUX-STYLE ACTIONS");
console.log("-".repeat(50));

const actions = [
  { type: "ADD_TODO", payload: { text: "Comprar leche" } },
  { type: "TOGGLE_TODO", payload: { id: 42 } },
  { type: "DELETE_TODO", payload: { id: 13 } },
  { type: "UNKNOWN_ACTION", payload: {} }
];

actions.forEach(action => {
  const resultado = match(action)
    .when({ type: "ADD_TODO", payload: { text: "$t" } }, (b) =>
      `➕ Añadido: "${b.t}"`)
    .when({ type: "TOGGLE_TODO", payload: { id: "$id" } }, (b) =>
      `🔄 Toggle TODO #${b.id}`)
    .when({ type: "DELETE_TODO", payload: { id: "$id" } }, (b) =>
      `🗑️  Eliminado TODO #${b.id}`)
    .else("❓ Acción desconocida");

  console.log(resultado);
});

// ========== 9. MÚLTIPLES CAPTURAS ==========
console.log("\n📌 9. MÚLTIPLES CAPTURAS");
console.log("-".repeat(50));

const empleado = {
  name: "Bob",
  age: 30,
  city: "Madrid",
  salary: 50000
};

console.log("Empleado:", JSON.stringify(empleado));

const resultado9 = match(empleado)
  .when({ name: "$n", age: "$a", city: "$c", salary: "$s" }, (b) =>
    `📝 ${b.n} (${b.a} años) - ${b.c} - €${b.s}/año`)
  .else("Sin datos completos");

console.log(resultado9);

// ========== 10. OBJETOS ANIDADOS ==========
console.log("\n📌 10. OBJETOS PROFUNDAMENTE ANIDADOS");
console.log("-".repeat(50));

const datos = {
  user: {
    profile: {
      role: "admin",
      permissions: ["read", "write", "delete"]
    }
  }
};

console.log("Datos:", JSON.stringify(datos, null, 2));

const resultado10 = match(datos)
  .when({ user: { profile: { role: "admin" } } },
    "🔐 Admin con privilegios completos")
  .when({ user: { profile: { role: "user" } } },
    "👤 Usuario estándar")
  .else("❌ Sin permisos");

console.log(`Resultado: ${resultado10}`);

// ========== 11. GUARDS EN PROPIEDADES ==========
console.log("\n📌 11. GUARDS EN PROPIEDADES DE OBJETOS");
console.log("-".repeat(50));

const estudiantes = [
  { name: "Ana", score: 95 },
  { name: "Bob", score: 75 },
  { name: "Carlos", score: 60 },
];

estudiantes.forEach(est => {
  const calificacion = match(est)
    .when({ score: (s) => s >= 90 }, "🏆 Excelente")
    .when({ score: (s) => s >= 70 }, "✅ Aprobado")
    .when({ score: (s) => s >= 60 }, "⚠️  Suficiente")
    .else("❌ Reprobado");

  console.log(`${est.name} (${est.score} pts): ${calificacion}`);
});

// ========== 12. STATE MACHINE ==========
console.log("\n📌 12. STATE MACHINE");
console.log("-".repeat(50));

const transitions = [
  { state: "idle", event: "start" },
  { state: "loading", event: "success" },
  { state: "ready", event: "error" },
  { state: "error", event: "retry" },
];

console.log("Transiciones de estado:");
transitions.forEach(({ state, event }) => {
  const nextState = match({ state, event })
    .when({ state: "idle", event: "start" }, "loading")
    .when({ state: "loading", event: "success" }, "ready")
    .when({ state: "loading", event: "error" }, "error")
    .when({ state: "error", event: "retry" }, "loading")
    .when({ state: _, event: "reset" }, "idle")
    .else(state);

  console.log(`  [${state}] --${event}--> [${nextState}]`);
});

// ========== 13. COMPARACIÓN CON SWITCH ==========
console.log("\n📌 13. VS SWITCH TRADICIONAL");
console.log("-".repeat(50));

const userRole = { role: "admin", name: "Juan" };

// ❌ Forma tradicional (verbosa)
console.log("❌ Con switch:");
let resultSwitch;
switch(userRole.role) {
  case "admin":
    resultSwitch = `Hola ${userRole.name} (admin)`;
    break;
  case "user":
    resultSwitch = "Hola usuario";
    break;
  default:
    resultSwitch = "Invitado";
}
console.log(`   ${resultSwitch}`);

// ✅ Con match (elegante)
console.log("\n✅ Con match:");
const resultMatch = match(userRole)
  .when({ role: "admin", name: "$n" }, (b) => `Hola ${b.n} (admin)`)
  .when({ role: "user" }, "Hola usuario")
  .else("Invitado");
console.log(`   ${resultMatch}`);

console.log("\n" + "=".repeat(50));
console.log("✨ Showcase completado!\n");
