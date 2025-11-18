/**
 * TODO App - Ejemplo usando pattern matching con match()
 *
 * Este ejemplo demuestra cómo usar match() para:
 * - Reducers estilo Redux
 * - Validación de comandos
 * - Filtrado de datos
 */

import { match, _ } from "../src/match.js";

// ========== Estado inicial ==========
let todos = [
  { id: 1, text: "Aprender pattern matching", done: false },
  { id: 2, text: "Crear una TODO app", done: true },
  { id: 3, text: "Compartir en GitHub", done: false },
];

// ========== Reducer usando match() ==========
function todoReducer(state, action) {
  return match(action)
    // Agregar nuevo TODO
    .when({ type: "ADD_TODO", payload: { text: "$text" } }, (b) => [
      ...state,
      { id: Date.now(), text: b.text, done: false }
    ])

    // Toggle TODO por ID
    .when({ type: "TOGGLE_TODO", payload: { id: "$id" } }, (b) =>
      state.map(todo =>
        todo.id === b.id ? { ...todo, done: !todo.done } : todo
      )
    )

    // Eliminar TODO
    .when({ type: "DELETE_TODO", payload: { id: "$id" } }, (b) =>
      state.filter(todo => todo.id !== b.id)
    )

    // Editar texto
    .when({ type: "EDIT_TODO", payload: { id: "$id", text: "$text" } }, (b) =>
      state.map(todo =>
        todo.id === b.id ? { ...todo, text: b.text } : todo
      )
    )

    // Completar todos
    .when({ type: "COMPLETE_ALL" }, () =>
      state.map(todo => ({ ...todo, done: true }))
    )

    // Limpiar completados
    .when({ type: "CLEAR_COMPLETED" }, () =>
      state.filter(todo => !todo.done)
    )

    // Estado sin cambios
    .else(state);
}

// ========== Validador de comandos ==========
function validateCommand(cmd) {
  return match(cmd)
    .when({ type: "ADD_TODO", payload: { text: "$t" } }, (b) =>
      b.t.trim().length > 0 ? { valid: true } : { valid: false, error: "Texto vacío" }
    )

    .when({ type: "TOGGLE_TODO", payload: { id: "$id" } }, (b) =>
      typeof b.id === "number" ? { valid: true } : { valid: false, error: "ID inválido" }
    )

    .when({ type: _, payload: _ }, () =>
      ({ valid: true })
    )

    .else({ valid: false, error: "Comando desconocido" });
}

// ========== Filtros ==========
function filterTodos(todos, filter) {
  return match(filter)
    .when("all", todos)
    .when("active", todos.filter(t => !t.done))
    .when("completed", todos.filter(t => t.done))
    .else(todos);
}

// ========== Estadísticas ==========
function getStats(todos) {
  const total = todos.length;
  const completed = todos.filter(t => t.done).length;
  const active = total - completed;

  return match({ total, completed, active })
    .when({ total: 0 }, "No hay tareas")
    .when({ active: 0 }, `¡Todas completadas! (${total} tareas)`)
    .when({ completed: 0 }, `${active} tareas pendientes`)
    .else(() =>
      `${active} pendientes, ${completed} completadas de ${total}`
    );
}

// ========== Prioridad de TODOs ==========
function getPriority(todo) {
  const wordCount = todo.text.split(" ").length;

  return match(todo)
    .when({ done: true }, "✅ Completado")
    .when({ text: (t) => t.includes("urgente") || t.includes("ASAP") }, "🔴 Alta")
    .when({ text: (t) => t.includes("importante") }, "🟡 Media")
    .when({ text: (t) => wordCount > 10 }, "🟡 Media (larga)")
    .else("🟢 Baja");
}

// ========== Ejecutar ejemplos ==========
console.log("🎯 TODO App con Pattern Matching\n");

// Ejemplo 1: Agregar TODO
console.log("📝 Agregando TODO:");
const cmd1 = { type: "ADD_TODO", payload: { text: "Hacer ejercicio" } };
const validation1 = validateCommand(cmd1);
console.log(`  Validación:`, validation1);

if (validation1.valid) {
  todos = todoReducer(todos, cmd1);
  console.log(`  ✅ TODO agregado. Total: ${todos.length}`);
}

// Ejemplo 2: Toggle TODO
console.log("\n🔄 Toggleando TODO #1:");
todos = todoReducer(todos, { type: "TOGGLE_TODO", payload: { id: 1 } });
console.log(`  Estado:`, todos.find(t => t.id === 1).done ? "Completado" : "Pendiente");

// Ejemplo 3: Filtros
console.log("\n🔍 Filtrando TODOs:");
console.log(`  Activos: ${filterTodos(todos, "active").length}`);
console.log(`  Completados: ${filterTodos(todos, "completed").length}`);
console.log(`  Todos: ${filterTodos(todos, "all").length}`);

// Ejemplo 4: Estadísticas
console.log("\n📊 Estadísticas:");
console.log(`  ${getStats(todos)}`);

// Ejemplo 5: Prioridades
console.log("\n🎯 Prioridades:");
todos.forEach(todo => {
  console.log(`  ${getPriority(todo)} - ${todo.text}`);
});

// Ejemplo 6: Comando inválido
console.log("\n❌ Validando comando inválido:");
const invalidCmd = { type: "ADD_TODO", payload: { text: "" } };
console.log(`  Resultado:`, validateCommand(invalidCmd));

// Ejemplo 7: Completar todos
console.log("\n✅ Completando todos:");
todos = todoReducer(todos, { type: "COMPLETE_ALL" });
console.log(`  ${getStats(todos)}`);

// Ejemplo 8: Limpiar completados
console.log("\n🗑️  Limpiando completados:");
todos = todoReducer(todos, { type: "CLEAR_COMPLETED" });
console.log(`  TODOs restantes: ${todos.length}`);

console.log("\n✨ Demo completada!");
