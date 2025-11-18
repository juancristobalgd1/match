/**
 * SINTAXIS SUPER LIMPIA - Pattern Matching sin .when()
 */

import { match, _ } from "../src/match.js";

console.log("✨ SINTAXIS ULTRA LIMPIA - Sin .when()!\n");
console.log("=".repeat(60));

// ========== 1. BÁSICO - NÚMEROS ==========
console.log("\n📌 1. MATCHING DE NÚMEROS");
console.log("-".repeat(60));

const numero = 2;
const r1 = match(numero)
  (1, "uno")
  (2, "dos")
  (3, "tres")
  (_, "otro");

console.log(`match(${numero})
  (1, "uno")
  (2, "dos")
  (3, "tres")
  (_, "otro")

=> "${r1}"`);

// ========== 2. OBJETOS CON DESTRUCTURING ==========
console.log("\n📌 2. OBJETOS CON DESTRUCTURING");
console.log("-".repeat(60));

const user = { name: "Ana", role: "admin", age: 28 };
console.log("Usuario:", JSON.stringify(user));
console.log("");

const r2 = match(user)
  ({ role: "admin", name: "$nombre" }, b => `👑 Hola jefe ${b.nombre}!`)
  ({ role: "user", name: "$nombre" }, b => `👋 Hola ${b.nombre}`)
  (_, "👻 Invitado");

console.log(`match(user)
  ({ role: "admin", name: "$nombre" }, b => \`👑 Hola jefe \${b.nombre}!\`)
  ({ role: "user", name: "$nombre" }, b => \`👋 Hola \${b.nombre}\`)
  (_, "👻 Invitado")

=> ${r2}`);

// ========== 3. WILDCARDS EN OBJETOS ==========
console.log("\n📌 3. WILDCARDS EN OBJETOS");
console.log("-".repeat(60));

const r3 = match(user)
  ({ role: "admin", perms: _ }, "Admin con permisos")
  ({ role: "admin" }, "Admin sin campo perms")
  (_, "No admin");

console.log(`match(user)
  ({ role: "admin", perms: _ }, "Admin con permisos")
  ({ role: "admin" }, "Admin sin campo perms")
  (_, "No admin")

=> "${r3}"`);

// ========== 4. ARRAYS/TUPLAS ==========
console.log("\n📌 4. ARRAYS Y TUPLAS");
console.log("-".repeat(60));

const coords = [1, 999, 3];
const r4 = match(coords)
  ([1, _, 3], "Primero y último coinciden")
  ([_, 2, _], "Medio es 2")
  (_, "Otra combinación");

console.log(`match([1, 999, 3])
  ([1, _, 3], "Primero y último coinciden")
  ([_, 2, _], "Medio es 2")
  (_, "Otra combinación")

=> "${r4}"`);

// ========== 5. GUARDS ==========
console.log("\n📌 5. GUARDS (FUNCIONES)");
console.log("-".repeat(60));

const edad = 17;
const r5 = match(edad)
  (x => x >= 18, "🔞 Mayor de edad")
  (x => x >= 13, "👦 Adolescente")
  (_, "👶 Niño");

console.log(`match(${edad})
  (x => x >= 18, "🔞 Mayor de edad")
  (x => x >= 13, "👦 Adolescente")
  (_, "👶 Niño")

=> ${r5}`);

// ========== 6. REDUX ACTIONS ==========
console.log("\n📌 6. REDUX-STYLE ACTIONS");
console.log("-".repeat(60));

const action = {
  type: "ADD_TODO",
  payload: { text: "Aprender pattern matching" }
};

console.log("Action:", JSON.stringify(action));
console.log("");

const r6 = match(action)
  ({ type: "ADD_TODO", payload: { text: "$t" } }, b => `➕ Añadido: "${b.t}"`)
  ({ type: "TOGGLE_TODO", payload: { id: "$id" } }, b => `🔄 Toggle #${b.id}`)
  ({ type: "DELETE_TODO", payload: { id: "$id" } }, b => `🗑️  Eliminado #${b.id}`)
  (_, "❓ Acción desconocida");

console.log(`match(action)
  ({ type: "ADD_TODO", payload: { text: "$t" } }, b => \`➕ Añadido: "\${b.t}"\`)
  ({ type: "TOGGLE_TODO", payload: { id: "$id" } }, b => \`🔄 Toggle #\${b.id}\`)
  ({ type: "DELETE_TODO", payload: { id: "$id" } }, b => \`🗑️  Eliminado #\${b.id}\`)
  (_, "❓ Acción desconocida")

=> ${r6}`);

// ========== 7. DESTRUCTURING MÚLTIPLE ==========
console.log("\n📌 7. MÚLTIPLES CAPTURAS");
console.log("-".repeat(60));

const empleado = { name: "Carlos", age: 30, city: "Barcelona", salary: 45000 };
console.log("Empleado:", JSON.stringify(empleado));
console.log("");

const r7 = match(empleado)
  ({ name: "$n", age: "$a", city: "$c", salary: "$s" },
    b => `📝 ${b.n} (${b.a} años) en ${b.c} - €${b.s}/año`)
  (_, "Datos incompletos");

console.log(`match(empleado)
  ({ name: "$n", age: "$a", city: "$c", salary: "$s" },
    b => \`📝 \${b.n} (\${b.a} años) en \${b.c} - €\${b.s}/año\`)
  (_, "Datos incompletos")

=> ${r7}`);

// ========== 8. COMPARACIÓN DIRECTA ==========
console.log("\n📌 8. COMPARACIÓN: ANTES vs AHORA");
console.log("-".repeat(60));

const value = { status: "success", data: { id: 42 } };

console.log("❌ Sintaxis antigua (.when):");
console.log(`match(value)
  .when({ status: "success", data: { id: "$id" } }, b => \`ID: \${b.id}\`)
  .when({ status: "error" }, "Error")
  .else("Otro")`);

console.log("\n✅ Sintaxis nueva (limpia):");
console.log(`match(value)
  ({ status: "success", data: { id: "$id" } }, b => \`ID: \${b.id}\`)
  ({ status: "error" }, "Error")
  (_, "Otro")`);

const resultado = match(value)
  ({ status: "success", data: { id: "$id" } }, b => `ID: ${b.id}`)
  ({ status: "error" }, "Error")
  (_, "Otro");

console.log(`\nResultado: "${resultado}"`);

// ========== 9. INLINE EN FUNCIONES ==========
console.log("\n📌 9. USO INLINE EN FUNCIONES");
console.log("-".repeat(60));

const clasificarEdad = (edad) => match(edad)
  (x => x >= 18, "Mayor")
  (x => x >= 13, "Adolescente")
  (_, "Niño");

const edades = [12, 15, 20, 25];
console.log("Clasificando edades:", edades);
edades.forEach(e => {
  console.log(`  ${e} años => ${clasificarEdad(e)}`);
});

// ========== 10. STATE MACHINE ==========
console.log("\n📌 10. STATE MACHINE (ULTRA LIMPIO)");
console.log("-".repeat(60));

const nextState = (state, event) => match({ state, event })
  ({ state: "idle", event: "start" }, "loading")
  ({ state: "loading", event: "success" }, "ready")
  ({ state: "loading", event: "error" }, "error")
  ({ state: "error", event: "retry" }, "loading")
  ({ state: _, event: "reset" }, "idle")
  (_, state); // Default: no cambia

console.log("Transiciones:");
console.log(`  idle + start     => ${nextState("idle", "start")}`);
console.log(`  loading + success => ${nextState("loading", "success")}`);
console.log(`  error + retry    => ${nextState("error", "retry")}`);
console.log(`  ready + reset    => ${nextState("ready", "reset")}`);

console.log("\n" + "=".repeat(60));
console.log("✨ ¡La sintaxis más limpia de pattern matching en JS!\n");
