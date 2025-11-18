import { match, _ } from "../src/match.js";

console.log("🧪 Testing match library...\n");

// Test 1: Números simples
const t1 = match(2)
  .when(1, "uno")
  .when(2, "dos")
  .when(3, "tres")
  .else("otro");
console.log(`Test 1 - Números simples: ${t1 === "dos" ? "✅" : "❌"}`);

// Test 2: Wildcard
const t2 = match(999)
  .when(1, "uno")
  .when(_, "cualquier cosa")
  .else("nunca");
console.log(`Test 2 - Wildcard: ${t2 === "cualquier cosa" ? "✅" : "❌"}`);

// Test 3: Objetos parciales
const user = { name: "Ana", role: "admin", age: 28 };
const t3 = match(user)
  .when({ role: "admin" }, "Eres admin")
  .when({ role: "user" }, "Usuario normal")
  .else("Invitado");
console.log(`Test 3 - Objeto parcial: ${t3 === "Eres admin" ? "✅" : "❌"}`);

// Test 4: Destructuring con $variable
const t4 = match(user)
  .when({ name: "$nombre", role: "admin" }, (b) => `Hola jefe ${b.nombre}`)
  .when({ name: "$nombre" }, (b) => `Hola ${b.nombre}`)
  .else("Anónimo");
console.log(`Test 4 - Destructuring: ${t4 === "Hola jefe Ana" ? "✅" : "❌"}`);

// Test 5: Arrays/Tuplas
const t5 = match([1, 999, 3])
  .when([1, _, 3], "Primero y último coinciden")
  .when([_, 2, _], "Medio es 2")
  .else("Otro");
console.log(`Test 5 - Tuplas: ${t5 === "Primero y último coinciden" ? "✅" : "❌"}`);

// Test 6: Guards (funciones)
const t6 = match(17)
  .when((x) => x >= 18, "Mayor de edad")
  .when((x) => x >= 13, "Adolescente")
  .else("Niño");
console.log(`Test 6 - Guards: ${t6 === "Adolescente" ? "✅" : "❌"}`);

// Test 7: Destructuring + valor en handler
const t7 = match({ age: 25, country: "ES" })
  .when({ age: "$edad", country: "ES" }, (b) => b.edad >= 18 ? "Mayor" : "Menor")
  .else("Extranjero");
console.log(`Test 7 - Destructuring + lógica: ${t7 === "Mayor" ? "✅" : "❌"}`);

// Test 8: Redux/Actions
const action = { type: "ADD_TODO", payload: { text: "Aprender match", done: false } };
const t8 = match(action)
  .when({ type: "ADD_TODO", payload: { text: "$t" } }, (b) => `Añadido: ${b.t}`)
  .when({ type: "TOGGLE_TODO", payload: { id: "$id" } }, (b) => `Toggle ${b.id}`)
  .else("Acción desconocida");
console.log(`Test 8 - Redux action: ${t8 === "Añadido: Aprender match" ? "✅" : "❌"}`);

// Test 9: Múltiples captures
const t9 = match({ name: "Bob", age: 30, city: "Madrid" })
  .when({ name: "$n", age: "$a", city: "$c" }, (b) => `${b.n}, ${b.a} años, ${b.c}`)
  .else("N/A");
console.log(`Test 9 - Múltiples captures: ${t9 === "Bob, 30 años, Madrid" ? "✅" : "❌"}`);

// Test 10: Nested objects
const t10 = match({ user: { name: "Ana", role: "admin" } })
  .when({ user: { role: "admin" } }, "Admin detectado")
  .else("No admin");
console.log(`Test 10 - Objetos anidados: ${t10 === "Admin detectado" ? "✅" : "❌"}`);

// Test 11: Sin else - devuelve undefined
const t11 = match(999)
  .when(1, "uno")
  .when(2, "dos")
  .else(undefined);
console.log(`Test 11 - Sin match: ${t11 === undefined ? "✅" : "❌"}`);

// Test 12: Primer match gana (no evalúa los demás)
let counter = 0;
const t12 = match(1)
  .when(1, () => { counter++; return "first"; })
  .when(1, () => { counter++; return "second"; })
  .else("none");
console.log(`Test 12 - Primer match gana: ${t12 === "first" && counter === 1 ? "✅" : "❌"}`);

// Test 13: Wildcard en objeto
const t13 = match({ a: 1, b: 2, c: 3 })
  .when({ a: 1, b: _, c: _ }, "a es 1, b y c son cualquier cosa")
  .else("No match");
console.log(`Test 13 - Wildcard en objeto: ${t13 === "a es 1, b y c son cualquier cosa" ? "✅" : "❌"}`);

// Test 14: Array exacto (debe tener misma longitud)
const t14 = match([1, 2])
  .when([1, 2, 3], "3 elementos")
  .when([1, 2], "2 elementos")
  .else("Otro");
console.log(`Test 14 - Array longitud exacta: ${t14 === "2 elementos" ? "✅" : "❌"}`);

// Test 15: Valores null/undefined
const t15 = match(null)
  .when(null, "Es null")
  .when(undefined, "Es undefined")
  .else("Otro");
console.log(`Test 15 - null/undefined: ${t15 === "Es null" ? "✅" : "❌"}`);

// Test 16: Arrays con wildcards
const t16 = match([1, 2, 3])
  .when([1, _, _], "Empieza con 1")
  .else("Otro");
console.log(`Test 16 - Arrays con wildcards: ${t16 === "Empieza con 1" ? "✅" : "❌"}`);

// Test 17: Guards con destructuring
const t17 = match({ score: 85, name: "Ana" })
  .when({ score: (s) => s >= 90 }, "Excelente")
  .when({ score: (s) => s >= 70 }, "Aprobado")
  .else("Reprobado");
console.log(`Test 17 - Guards en props: ${t17 === "Aprobado" ? "✅" : "❌"}`);

// Test 18: Matching exacto vs parcial
const t18 = match({ name: "Bob", age: 25 })
  .when({ name: "Bob", age: _ }, "Bob con edad")
  .when({ name: "Bob" }, "Solo Bob")
  .else("Otro");
console.log(`Test 18 - Matching exacto vs parcial: ${t18 === "Bob con edad" ? "✅" : "❌"}`);

// Test 19: Multiple levels de nesting
const t19 = match({ data: { user: { profile: { role: "admin" } } } })
  .when({ data: { user: { profile: { role: "admin" } } } }, "Admin encontrado")
  .else("No admin");
console.log(`Test 19 - Deep nesting: ${t19 === "Admin encontrado" ? "✅" : "❌"}`);

// Test 20: String patterns
const t20 = match("hello")
  .when("world", "Mundo")
  .when("hello", "Hola")
  .else("Desconocido");
console.log(`Test 20 - Strings: ${t20 === "Hola" ? "✅" : "❌"}`);

console.log("\n✨ Todos los tests completados!");
