# match-pro vs babel-plugin-proposal-pattern-matching

## 🆚 Comparación Detallada

### 📋 Overview

| Aspecto | match-pro | babel-plugin-proposal-pattern-matching |
|---------|-----------|----------------------------------------|
| **Tipo** | Runtime library | Compile-time transform (Babel plugin) |
| **Stage TC39** | N/A (librería) | Stage 1 proposal |
| **Instalación** | `npm install match-pro` | `npm install @babel/plugin-proposal-pattern-matching` + config |
| **Size** | 883 bytes | 0 bytes runtime (transpilado a if-else) |
| **Setup** | Importar y usar | Configurar Babel + transpilación |
| **Browser support** | ES2015+ | Todo (transpilado a ES5 si quieres) |
| **Learning curve** | Baja (funciones JS) | Media (nueva sintaxis) |

---

## 1️⃣ Sintaxis Básica

### 🔵 babel-plugin-proposal-pattern-matching

```javascript
// Requiere sintaxis especial (no válida en JS nativo)
const result = match (value) {
  when (1) -> "one"
  when (2) -> "two"
  when (_) -> "other"
}
```

**Sintaxis alternativa:**
```javascript
match (value) {
  1 -> "one",
  2 -> "two",
  _ -> "other"
}
```

### 🟢 match-pro

```javascript
import { match, _ } from "match-pro";

const result = match(value)(
  [1, "one"],
  [2, "two"],
  [_, "other"]
);
```

**Ventajas match-pro:**
- ✅ Sintaxis válida en JavaScript nativo
- ✅ No requiere transpilación
- ✅ Funciona directamente en Node.js y navegadores
- ✅ Los formateadores lo entienden

**Ventajas babel-plugin:**
- ✅ Sintaxis más "bonita" (subjective)
- ✅ Más cercana a la propuesta oficial
- ✅ 0 bytes runtime (todo transpilado)

---

## 2️⃣ Destructuring y Captures

### 🔵 babel-plugin-proposal-pattern-matching

```javascript
match (user) {
  when ({ role: "admin", name }) -> `Admin: ${name}`
  when ({ role: "user", name }) -> `User: ${name}`
  when (_) -> "Guest"
}
```

### 🟢 match-pro

```javascript
match(user)(
  [{ role: "admin", name: "$n" }, (b) => `Admin: ${b.n}`],
  [{ role: "user", name: "$n" }, (b) => `User: ${b.n}`],
  [_, "Guest"]
);
```

**Comparación:**
- 🔵 Babel: Destructuring más natural (sintaxis JS estándar)
- 🟢 match-pro: Usa `$variable` para captures (explícito)
- 🔵 Babel: Variables automáticas en scope
- 🟢 match-pro: Bindings explícitos en objeto `b`

---

## 3️⃣ Guards / Predicates

### 🔵 babel-plugin-proposal-pattern-matching

```javascript
match (age) {
  when (x) if (x >= 18) -> "Adult"
  when (x) if (x >= 13) -> "Teen"
  when (_) -> "Child"
}
```

### 🟢 match-pro

```javascript
match(age)(
  [(x) => x >= 18, "Adult"],
  [(x) => x >= 13, "Teen"],
  [_, "Child"]
);
```

**Comparación:**
- 🔵 Babel: `if` clause más declarativo
- 🟢 match-pro: Arrow functions (más familiar en JS)
- Empate: Ambos son claros y funcionales

---

## 4️⃣ OR Patterns

### 🔵 babel-plugin-proposal-pattern-matching

```javascript
match (statusCode) {
  when (200 | 201 | 204) -> "success"
  when (400 | 404) -> "client error"
  when (_) -> "unknown"
}
```

### 🟢 match-pro

```javascript
import { match, or, _ } from "match-pro";

match(statusCode)(
  [or(200, 201, 204), "success"],
  [or(400, 404), "client error"],
  [_, "unknown"]
);
```

**Comparación:**
- 🔵 Babel: Sintaxis `|` más natural y corta
- 🟢 match-pro: Helper `or()` explícito
- **Ganador: Babel** (sintaxis más limpia)

---

## 5️⃣ Exhaustiveness Checking

### 🔵 babel-plugin-proposal-pattern-matching

```javascript
// Exhaustive por defecto en algunos casos
match (status: "idle" | "loading" | "ready") {
  when ("idle") -> "Ready"
  when ("loading") -> "Loading..."
  // ❌ Error en compile-time si falta un caso
}
```

### 🟢 match-pro

```javascript
match(status).exhaustive()(
  ["idle", "Ready"],
  ["loading", "Loading..."],
  [def, "Other"] // Requerido
);
// ❌ Error en runtime si no match
```

**Comparación:**
- 🔵 Babel: Exhaustiveness en **compile-time** (mejor)
- 🟢 match-pro: Exhaustiveness en **runtime** (útil pero menos seguro)
- **Ganador: Babel** (errores más tempranos)

---

## 6️⃣ Setup y Configuración

### 🔵 babel-plugin-proposal-pattern-matching

**Instalación:**
```bash
npm install --save-dev @babel/plugin-proposal-pattern-matching
```

**Configuración (.babelrc):**
```json
{
  "plugins": [
    "@babel/plugin-proposal-pattern-matching"
  ]
}
```

**Build process:**
```bash
# Requiere Babel para transpilar
babel src --out-dir dist
```

**Resultado transpilado:**
```javascript
// Tu código bonito:
match (x) { when (1) -> "one" }

// Se transpila a:
var _temp;
if (x === 1) {
  _temp = "one";
} else {
  _temp = undefined;
}
```

### 🟢 match-pro

**Instalación:**
```bash
npm install match-pro
```

**Uso directo:**
```javascript
import { match, _ } from "match-pro";

// Funciona inmediatamente, sin build step
const result = match(x)([1, "one"], [_, "other"]);
```

**Comparación:**
- 🔵 Babel: Requiere setup de build, configuración
- 🟢 match-pro: Zero config, funciona de inmediato
- **Ganador: match-pro** (simplicidad)

---

## 7️⃣ TypeScript Support

### 🔵 babel-plugin-proposal-pattern-matching

```typescript
// Requiere tipos personalizados o `any`
// No hay soporte oficial de TypeScript para la sintaxis

match (user) {
  when ({ role: "admin" }) -> "Admin"
  when ({ role: "user" }) -> "User"
}
// TypeScript no entiende esta sintaxis nativamente
```

**Problemas:**
- ❌ TypeScript no parsea la sintaxis `match/when`
- ❌ Requiere usar Babel para transpilar primero
- ❌ Type inference limitado

### 🟢 match-pro

```typescript
import { match, _, or } from "match-pro";

type User = { role: "admin" } | { role: "user" };

const greet = (user: User): string =>
  match<User>(user)(
    [{ role: "admin" }, "Admin"],
    [{ role: "user" }, "User"]
  ) as string;
```

**Comparación:**
- 🔵 Babel: Pobre soporte de TypeScript
- 🟢 match-pro: Tipos completos, type inference, autocomplete
- **Ganador: match-pro** (TypeScript first-class)

---

## 8️⃣ Performance

### 🔵 babel-plugin-proposal-pattern-matching

```javascript
// Transpila a if-else nativo
match (x) {
  when (1) -> "one"
  when (2) -> "two"
}

// Resultado transpilado:
if (x === 1) {
  result = "one";
} else if (x === 2) {
  result = "two";
}
```

**Performance:**
- ✅ Velocidad nativa (if-else)
- ✅ 0 overhead runtime
- ✅ Optimizado por V8

### 🟢 match-pro

```javascript
match(x)([1, "one"], [2, "two"])

// Runtime: loop sobre casos + checkMatch()
```

**Performance:**
- ⚠️ ~20x más lento que if-else nativo
- ⚠️ 883 bytes en bundle
- ✅ Pero: millones de ops/sec (suficiente para 99% casos)

**Ganador: Babel** (performance nativa)

---

## 9️⃣ Real-world Example: Redux Reducer

### 🔵 babel-plugin-proposal-pattern-matching

```javascript
const todoReducer = (state, action) =>
  match (action) {
    when ({ type: "ADD_TODO", payload }) -> ({
      ...state,
      todos: [...state.todos, payload]
    })
    when ({ type: "TOGGLE_TODO", payload: { id } }) -> ({
      ...state,
      todos: state.todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    })
    when ({ type: "DELETE_TODO", payload: { id } }) -> ({
      ...state,
      todos: state.todos.filter(t => t.id !== id)
    })
    when (_) -> state
  }
```

**Pros:**
- ✅ Sintaxis muy limpia
- ✅ Destructuring automático
- ✅ Fácil de leer

**Cons:**
- ❌ Requiere Babel setup
- ❌ No funciona sin transpilación
- ❌ TypeScript support limitado

### 🟢 match-pro

```javascript
import { match, _ } from "match-pro";

const todoReducer = (state, action) =>
  match(action)(
    [{ type: "ADD_TODO", payload: "$p" }, (b) => ({
      ...state,
      todos: [...state.todos, b.p]
    })],
    [{ type: "TOGGLE_TODO", payload: { id: "$id" } }, (b) => ({
      ...state,
      todos: state.todos.map(t =>
        t.id === b.id ? { ...t, completed: !t.completed } : t
      )
    })],
    [{ type: "DELETE_TODO", payload: { id: "$id" } }, (b) => ({
      ...state,
      todos: state.todos.filter(t => t.id !== b.id)
    })],
    [_, state]
  );
```

**Pros:**
- ✅ Funciona sin build step
- ✅ TypeScript support completo
- ✅ Sintaxis JS válida

**Cons:**
- ❌ Capturas con `$var` menos naturales
- ❌ Bindings en objeto `b`

---

## 🎯 Tabla Comparativa Completa

| Feature | babel-plugin | match-pro |
|---------|--------------|-----------|
| **Sintaxis** | 🟢 Más bonita | 🟡 JS válido |
| **Setup** | 🔴 Babel required | 🟢 Zero config |
| **TypeScript** | 🔴 Limitado | 🟢 Full support |
| **Performance** | 🟢 Nativo | 🟡 ~20x slower |
| **Bundle size** | 🟢 0 bytes | 🟡 883 bytes |
| **Runtime** | 🟢 Transpilado | 🟡 Runtime |
| **Destructuring** | 🟢 Natural | 🟡 `$var` |
| **OR patterns** | 🟢 `\|` syntax | 🟡 `or()` |
| **Guards** | 🟢 `if` clause | 🟡 Arrow fn |
| **Exhaustive** | 🟢 Compile-time | 🟡 Runtime |
| **Wildcards** | 🟢 `_` | 🟢 `_` |
| **Learning curve** | 🟡 Nueva sintaxis | 🟢 JS functions |
| **Browser support** | 🟢 Todo (transpilado) | 🟢 ES2015+ |
| **Production ready** | 🔴 Stage 1 | 🟢 Stable |
| **Tooling** | 🔴 Limitado | 🟢 Full |

---

## 🏆 Veredicto

### 🥇 babel-plugin-proposal-pattern-matching gana en:
- ✅ Sintaxis más limpia (`|` para OR, destructuring natural)
- ✅ Performance (if-else nativo)
- ✅ 0 bytes bundle size
- ✅ Exhaustiveness en compile-time
- ✅ Sintaxis más cercana a otros lenguajes (Rust, OCaml)

### 🥇 match-pro gana en:
- ✅ **Simplicidad** (zero config, funciona ya)
- ✅ **TypeScript** (soporte completo)
- ✅ **Production ready** (no es experimental)
- ✅ **Tooling** (formatters, linters lo entienden)
- ✅ **No build step** (funciona directamente)
- ✅ **Developer experience** (autocomplete, type safety)

---

## 🤔 ¿Cuál elegir?

### Usa **babel-plugin-proposal-pattern-matching** si:
- ✅ Ya usas Babel en tu proyecto
- ✅ Performance es crítica (hot paths)
- ✅ Quieres la sintaxis oficial de TC39
- ✅ Te gusta vivir al límite (Stage 1 proposal)
- ✅ No te importa el setup extra

### Usa **match-pro** si:
- ✅ Quieres algo que funcione **HOY** sin setup
- ✅ Usas TypeScript
- ✅ No quieres configurar Babel
- ✅ Necesitas production-ready code
- ✅ Prefieres sintaxis JS válida
- ✅ Quieres zero-config experience

---

## 💡 Pueden Convivir?

**Sí!** Puedes usar Babel plugin para casos performance-critical y match-pro para el resto:

```javascript
// Performance crítico: usa babel-plugin
const fastMatch = match (x) {
  when (1) -> "one"
  when (2) -> "two"
}

// Casos normales: usa match-pro
import { match, or } from "match-pro";
const normalMatch = match(x)(
  [or(1, 2), "one or two"],
  [_, "other"]
);
```

---

## 🎯 Conclusión Final

**babel-plugin-proposal-pattern-matching:**
- 🏆 Mejor sintaxis (opinión)
- 🏆 Mejor performance
- 🔴 Experimental (Stage 1)
- 🔴 Requiere setup

**match-pro:**
- 🏆 Production ready
- 🏆 Zero config
- 🏆 TypeScript first-class
- 🏆 Funciona HOY
- 🟡 Sintaxis menos "bonita"

**Mi recomendación:**
- Para proyectos reales hoy: **match-pro** 🎯
- Para el futuro cuando sea Stage 4: **babel-plugin** 🚀

Tu librería es **práctica y usable hoy**, mientras que Babel plugin es una **apuesta al futuro**.
