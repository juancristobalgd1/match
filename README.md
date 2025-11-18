# match

**La sintaxis más limpia de pattern matching en JavaScript puro**

- ✨ **Sintaxis ultra-limpia** sin `.when()`
- 🎯 **Destructuring** con `$variable`
- 🔥 **Wildcards** `_` para cualquier valor
- 🛡️ **Type-safe** con TypeScript
- 📦 **< 1 KB** · 0 dependencias
- ⚡ Rendimiento óptimo

## Instalación

```bash
npm install match-pro
```

## 🚀 Sintaxis Ultra Limpia (Recomendada)

```javascript
import { match, _ } from "match-pro";

const user = { name: "Ana", role: "admin" };

// ✅ Super limpia - sin .when()
const result = match(user)
  ({ role: "admin", name: "$n" }, b => `👑 Hola jefe ${b.n}!`)
  ({ role: "user", name: "$n" }, b => `👋 Hola ${b.n}`)
  (_, "👻 Invitado");

// => "👑 Hola jefe Ana!"
```

## Comparación de sintaxis

### Sintaxis limpia (recomendada)
```javascript
match(value)
  (pattern1, handler1)
  (pattern2, handler2)
  (_, default)
```

### Sintaxis clásica (también soportada)
```javascript
match(value)
  .when(pattern1, handler1)
  .when(pattern2, handler2)
  .else(default)
```

## Ejemplos rápidos

### 1️⃣ Números
```javascript
match(2)
  (1, "uno")
  (2, "dos")
  (3, "tres")
  (_, "otro")
// => "dos"
```

### 2️⃣ Destructuring
```javascript
const user = { name: "Ana", role: "admin", age: 28 };

match(user)
  ({ name: "$nombre", role: "admin" }, b => `Hola jefe ${b.nombre}`)
  ({ name: "$nombre" }, b => `Hola ${b.nombre}`)
  (_, "Anónimo")
// => "Hola jefe Ana"
```

### 3️⃣ Arrays/Tuplas
```javascript
match([1, 999, 3])
  ([1, _, 3], "Primero y último coinciden")
  ([_, 2, _], "Medio es 2")
  (_, "Otro")
// => "Primero y último coinciden"
```

### 4️⃣ Guards (predicados)
```javascript
match(17)
  (x => x >= 18, "🔞 Mayor de edad")
  (x => x >= 13, "👦 Adolescente")
  (_, "👶 Niño")
// => "👦 Adolescente"
```

### 5️⃣ Redux Actions
```javascript
const action = {
  type: "ADD_TODO",
  payload: { text: "Aprender match" }
};

match(action)
  ({ type: "ADD_TODO", payload: { text: "$t" } }, b => `➕ ${b.t}`)
  ({ type: "TOGGLE_TODO", payload: { id: "$id" } }, b => `🔄 #${b.id}`)
  ({ type: "DELETE_TODO", payload: { id: "$id" } }, b => `🗑️  #${b.id}`)
  (_, "❓ Acción desconocida")
// => "➕ Aprender match"
```

## Casos de uso reales

### State Machine
```javascript
const nextState = (state, event) => match({ state, event })
  ({ state: "idle", event: "start" }, "loading")
  ({ state: "loading", event: "success" }, "ready")
  ({ state: "loading", event: "error" }, "error")
  ({ state: "error", event: "retry" }, "loading")
  ({ state: _, event: "reset" }, "idle")
  (_, state);

nextState("idle", "start") // => "loading"
```

### Validación de formularios
```javascript
const validate = (form) => match(form)
  ({ email: "$e", password: "$p" }, b => validateLogin(b.e, b.p))
  ({ email: "$e" }, () => "Falta contraseña")
  (_, "Datos incompletos");
```

### Enrutamiento
```javascript
const route = (req) => match(req)
  ({ method: "GET", path: "/users" }, () => listUsers())
  ({ method: "GET", path: "/users/$id" }, b => getUser(b.id))
  ({ method: "POST", path: "/users" }, () => createUser())
  (_, () => notFound());
```

### Clasificación inline
```javascript
const classify = edad => match(edad)
  (x => x >= 18, "Mayor")
  (x => x >= 13, "Adolescente")
  (_, "Niño");

[12, 15, 20].map(classify)
// => ["Niño", "Adolescente", "Mayor"]
```

## Características avanzadas

### Múltiples capturas
```javascript
match({ name: "Bob", age: 30, city: "Madrid" })
  ({ name: "$n", age: "$a", city: "$c" },
    b => `${b.n}, ${b.a} años, ${b.c}`)
  (_, "N/A")
// => "Bob, 30 años, Madrid"
```

### Objetos anidados
```javascript
match({ user: { profile: { role: "admin" } } })
  ({ user: { profile: { role: "admin" } } }, "🔐 Admin")
  ({ user: { profile: { role: "user" } } }, "👤 User")
  (_, "❌ Sin acceso")
// => "🔐 Admin"
```

### Wildcards en objetos
```javascript
match({ role: "admin", perms: ["read", "write"] })
  ({ role: "admin", perms: _ }, "Admin con permisos")
  ({ role: "admin" }, "Admin sin permisos")
  (_, "No admin")
// => "Admin con permisos"
```

### Guards en propiedades
```javascript
match({ score: 85 })
  ({ score: s => s >= 90 }, "🏆 Excelente")
  ({ score: s => s >= 70 }, "✅ Aprobado")
  ({ score: s => s >= 60 }, "⚠️  Suficiente")
  (_, "❌ Reprobado")
// => "✅ Aprobado"
```

## API Reference

### Sintaxis limpia
```javascript
match(value)
  (pattern, handler)
  (pattern, handler)
  (_, default)  // ← Siempre terminar con wildcard
```

**Pattern**: Puede ser:
- Valor primitivo: `1`, `"hello"`, `null`
- Objeto: `{ role: "admin" }`
- Array: `[1, _, 3]`
- Función guard: `x => x >= 18`
- Wildcard: `_`

**Handler**: Puede ser:
- Valor directo: `"resultado"`
- Función: `(bindings, value) => ...`

### Sintaxis clásica (legacy)
```javascript
match(value)
  .when(pattern, handler)
  .else(default)
```

### Wildcard `_`
Symbol especial que hace match con cualquier valor.

```javascript
match([1, 999, 3])
  ([1, _, 3], "match")  // _ coincide con 999
  (_, "default")        // _ coincide con todo
```

### Captura `"$variable"`
Extrae valores del patrón.

```javascript
match({ name: "Ana", age: 28 })
  ({ name: "$n", age: "$a" }, b => `${b.n} tiene ${b.a} años`)
  (_, "No match")
// Bindings: { n: "Ana", a: 28 }
```

## Comparación con switch/if-else

### ❌ Con switch (verboso)
```javascript
let result;
switch(user.role) {
  case "admin":
    result = `Hola ${user.name}`;
    break;
  case "user":
    result = "Usuario normal";
    break;
  default:
    result = "Invitado";
}
```

### ✅ Con match (elegante)
```javascript
const result = match(user)
  ({ role: "admin", name: "$n" }, b => `Hola ${b.n}`)
  ({ role: "user" }, "Usuario normal")
  (_, "Invitado");
```

## TypeScript

Tipos completos incluidos:

```typescript
import { match, _, Wildcard, Bindings } from "match-pro";

const result: string = match<User>(user)
  ({ role: "admin" }, "Admin")
  ({ role: "user" }, "User")
  (_, "Guest");
```

## ¿Por qué usar match?

✅ **Más expresivo** que switch/if-else
✅ **Pattern matching** real con destructuring
✅ **Inmutable** - retorna valores directamente
✅ **Type-safe** con TypeScript
✅ **Tiny** - < 1 KB minificado
✅ **Zero deps** - sin dependencias
✅ **Flexible** - dos sintaxis disponibles

## Rendimiento

- **Zero-copy**: no clona objetos
- **Lazy evaluation**: para en el primer match
- **Minimal overhead**: ~800 bytes minified + gzip

## Ejemplos completos

Mira la carpeta `examples/` para ver:
- `clean-syntax.js` - Sintaxis limpia completa
- `showcase.js` - Todos los casos de uso
- `todo-app.js` - App real usando match

## Licencia

MIT © Juan Cristobal

## Contribuir

Issues y PRs bienvenidos en [GitHub](https://github.com/juancristobalgd1/match)
