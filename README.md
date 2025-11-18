# match

**Pattern matching elegante y ligero en JavaScript puro**

- ✨ Sintaxis limpia e intuitiva
- 🎯 Destructuring con `$variable`
- 🔥 Wildcards `_` para cualquier valor
- 🛡️ Type-safe con TypeScript
- 📦 < 1 KB · 0 dependencias
- ⚡ Rendimiento óptimo

## Instalación

```bash
npm install match-pro
```

## Uso básico

```javascript
import { match, _ } from "match-pro";

// Matching de números
const result = match(2)
  .when(1, "uno")
  .when(2, "dos")
  .when(3, "tres")
  .else("otro");
// => "dos"

// Con wildcard
const result2 = match(999)
  .when(1, "uno")
  .when(_, "cualquier cosa")
  .else("nunca");
// => "cualquier cosa"
```

## Características principales

### 1️⃣ Matching de objetos (parcial)

```javascript
const user = { name: "Ana", role: "admin", age: 28 };

match(user)
  .when({ role: "admin" }, "Eres admin")
  .when({ role: "user" }, "Usuario normal")
  .else("Invitado");
// => "Eres admin"
```

### 2️⃣ Destructuring con `$variable`

```javascript
match(user)
  .when({ name: "$nombre", role: "admin" }, (b) => `Hola jefe ${b.nombre}`)
  .when({ name: "$nombre" }, (b) => `Hola ${b.nombre}`)
  .else("Anónimo");
// => "Hola jefe Ana"
```

### 3️⃣ Arrays/Tuplas con wildcards

```javascript
match([1, 999, 3])
  .when([1, _, 3], "Primero y último coinciden")
  .when([_, 2, _], "Medio es 2")
  .else("Otro");
// => "Primero y último coinciden"
```

### 4️⃣ Guards (funciones)

```javascript
match(17)
  .when((x) => x >= 18, "Mayor de edad")
  .when((x) => x >= 13, "Adolescente")
  .else("Niño");
// => "Adolescente"
```

### 5️⃣ Destructuring + lógica combinada

```javascript
match({ age: 25, country: "ES" })
  .when({ age: "$edad", country: "ES" }, (b) => b.edad >= 18 ? "Mayor" : "Menor")
  .else("Extranjero");
// => "Mayor"
```

## Casos de uso reales

### Redux/Actions

```javascript
const action = {
  type: "ADD_TODO",
  payload: { text: "Aprender match", done: false }
};

match(action)
  .when({ type: "ADD_TODO", payload: { text: "$t" } },
    (b) => `Añadido: ${b.t}`)
  .when({ type: "TOGGLE_TODO", payload: { id: "$id" } },
    (b) => `Toggle ${b.id}`)
  .else("Acción desconocida");
// => "Añadido: Aprender match"
```

### Validación de formularios

```javascript
match(formData)
  .when({ email: "$e", password: "$p" }, (b) =>
    validateLogin(b.e, b.p))
  .when({ email: "$e" }, () =>
    "Falta contraseña")
  .else("Datos incompletos");
```

### Enrutamiento

```javascript
match(request)
  .when({ method: "GET", path: "/users" }, () => listUsers())
  .when({ method: "GET", path: "/users/$id" }, (b) => getUser(b.id))
  .when({ method: "POST", path: "/users" }, () => createUser())
  .else(() => notFound());
```

### State machines

```javascript
match({ state: currentState, event: userEvent })
  .when({ state: "idle", event: "start" }, "loading")
  .when({ state: "loading", event: "success" }, "ready")
  .when({ state: "loading", event: "error" }, "failed")
  .when({ state: _, event: "reset" }, "idle")
  .else(currentState);
```

## Características avanzadas

### Múltiples capturas

```javascript
match({ name: "Bob", age: 30, city: "Madrid" })
  .when({ name: "$n", age: "$a", city: "$c" },
    (b) => `${b.n}, ${b.a} años, ${b.c}`)
  .else("N/A");
// => "Bob, 30 años, Madrid"
```

### Objetos anidados

```javascript
match({ user: { name: "Ana", role: "admin" } })
  .when({ user: { role: "admin" } }, "Admin detectado")
  .else("No admin");
// => "Admin detectado"
```

### Wildcards en objetos

```javascript
match({ a: 1, b: 2, c: 3 })
  .when({ a: 1, b: _, c: _ }, "a es 1, resto cualquier cosa")
  .else("No match");
// => "a es 1, resto cualquier cosa"
```

### Guards en propiedades

```javascript
match({ score: 85, name: "Ana" })
  .when({ score: (s) => s >= 90 }, "Excelente")
  .when({ score: (s) => s >= 70 }, "Aprobado")
  .else("Reprobado");
// => "Aprobado"
```

## API Reference

### `match(value)`
Crea una nueva expresión de pattern matching.

### `.when(pattern, handler)`
Define un caso a evaluar.

**Parámetros:**
- `pattern`: Valor, objeto, array, función guard, o wildcard `_`
- `handler`: Valor a retornar o función `(bindings, value) => result`

**Retorna:** El objeto match para encadenar más `.when()`

### `.else(handler)`
Define el caso por defecto si ninguno hace match.

**Parámetros:**
- `handler`: Valor a retornar o función `(value) => result`

**Retorna:** El resultado final del matching

### Wildcard `_`
Symbol especial que hace match con cualquier valor.

```javascript
import { _ } from "match-pro";

match(value)
  .when(_, "Cualquier cosa")
  .else("Nunca se ejecuta");
```

### Captura `"$variable"`
Sintaxis especial para capturar valores en el pattern.

```javascript
match({ name: "Ana" })
  .when({ name: "$n" }, (b) => b.n) // b.n === "Ana"
  .else("No match");
```

## Comparación con switch/if-else

### ❌ Con switch (verboso, repetitivo)

```javascript
let result;
switch(user.role) {
  case "admin":
    result = `Hola ${user.name}`;
    break;
  case "user":
    result = "Hola usuario";
    break;
  default:
    result = "Invitado";
}
```

### ✅ Con match (limpio, expresivo)

```javascript
const result = match(user)
  .when({ role: "admin", name: "$n" }, (b) => `Hola ${b.n}`)
  .when({ role: "user" }, "Hola usuario")
  .else("Invitado");
```

## TypeScript

La librería incluye tipos completos:

```typescript
import { match, _, Wildcard, Bindings } from "match-pro";

const result: string = match<User>(user)
  .when({ role: "admin" }, "Admin")
  .else("User");
```

## Rendimiento

- Zero-copy: no clona objetos
- Lazy evaluation: para en el primer match
- Minimal overhead: ~800 bytes minified + gzip

## Licencia

MIT © Juan Cristobal

## Contribuir

Issues y PRs bienvenidos en [GitHub](https://github.com/juancristobalgd1/match)
