import { match, _ } from "../src/match.js";

console.log("🧪 Testing CLEAN SYNTAX (without .when)\n");

// Test 1: Números básicos
const t1 = match(2)
  (1, "uno")
  (2, "dos")
  (3, "tres")
  (_, "otro");
console.log(`Test 1 - Números: ${t1 === "dos" ? "✅" : "❌"}`);

// Test 2: Objetos con destructuring
const user = { name: "Ana", role: "admin" };
const t2 = match(user)
  ({ role: "admin", name: "$n" }, b => `Hola ${b.n}`)
  ({ role: "user" }, "Usuario")
  (_, "Invitado");
console.log(`Test 2 - Destructuring: ${t2 === "Hola Ana" ? "✅" : "❌"}`);

// Test 3: Arrays con wildcards
const t3 = match([1, 999, 3])
  ([1, _, 3], "match")
  ([_, 2, _], "no")
  (_, "otro");
console.log(`Test 3 - Arrays: ${t3 === "match" ? "✅" : "❌"}`);

// Test 4: Guards
const t4 = match(17)
  (x => x >= 18, "mayor")
  (x => x >= 13, "adolescente")
  (_, "niño");
console.log(`Test 4 - Guards: ${t4 === "adolescente" ? "✅" : "❌"}`);

// Test 5: Redux actions
const action = { type: "ADD_TODO", payload: { text: "test" } };
const t5 = match(action)
  ({ type: "ADD_TODO", payload: { text: "$t" } }, b => `Added: ${b.t}`)
  ({ type: "DELETE" }, "Deleted")
  (_, "Unknown");
console.log(`Test 5 - Redux: ${t5 === "Added: test" ? "✅" : "❌"}`);

// Test 6: Múltiples captures
const t6 = match({ a: 1, b: 2, c: 3 })
  ({ a: "$x", b: "$y", c: "$z" }, b => b.x + b.y + b.z)
  (_, 0);
console.log(`Test 6 - Múltiples captures: ${t6 === 6 ? "✅" : "❌"}`);

// Test 7: Objetos anidados
const t7 = match({ user: { profile: { role: "admin" } } })
  ({ user: { profile: { role: "admin" } } }, "admin")
  (_, "no admin");
console.log(`Test 7 - Nested: ${t7 === "admin" ? "✅" : "❌"}`);

// Test 8: Primer match gana
let counter = 0;
const t8 = match(1)
  (1, () => { counter++; return "first"; })
  (1, () => { counter++; return "second"; })
  (_, "default");
console.log(`Test 8 - First wins: ${t8 === "first" && counter === 1 ? "✅" : "❌"}`);

// Test 9: Wildcard como default
const t9 = match(999)
  (1, "uno")
  (2, "dos")
  (_, "default");
console.log(`Test 9 - Wildcard default: ${t9 === "default" ? "✅" : "❌"}`);

// Test 10: Sin default (retorna matcher con conversión)
const t10 = match(1)
  (2, "dos")
  (3, "tres")
  (_, undefined);
console.log(`Test 10 - Sin match: ${t10 === undefined ? "✅" : "❌"}`);

// Test 11: String patterns
const t11 = match("hello")
  ("world", "mundo")
  ("hello", "hola")
  (_, "otro");
console.log(`Test 11 - Strings: ${t11 === "hola" ? "✅" : "❌"}`);

// Test 12: null/undefined
const t12 = match(null)
  (null, "es null")
  (undefined, "es undefined")
  (_, "otro");
console.log(`Test 12 - null: ${t12 === "es null" ? "✅" : "❌"}`);

// Test 13: Guards en objetos
const t13 = match({ score: 85 })
  ({ score: s => s >= 90 }, "excelente")
  ({ score: s => s >= 70 }, "aprobado")
  (_, "reprobado");
console.log(`Test 13 - Guards en props: ${t13 === "aprobado" ? "✅" : "❌"}`);

// Test 14: Inline en funciones
const classify = edad => match(edad)
  (x => x >= 18, "mayor")
  (x => x >= 13, "adolescente")
  (_, "niño");

const t14 = classify(15);
console.log(`Test 14 - Inline function: ${t14 === "adolescente" ? "✅" : "❌"}`);

// Test 15: State machine
const nextState = (state, event) => match({ state, event })
  ({ state: "idle", event: "start" }, "loading")
  ({ state: "loading", event: "success" }, "ready")
  ({ state: _, event: "reset" }, "idle")
  (_, state);

const t15 = nextState("idle", "start");
console.log(`Test 15 - State machine: ${t15 === "loading" ? "✅" : "❌"}`);

console.log("\n✨ Clean syntax tests completados!");
