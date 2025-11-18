const _ = Symbol.for("match-wildcard");

export { _ };

export const match = (value) => {
  let matched = false;
  let result = undefined;

  // Función matcher que se puede llamar directamente: match(x)(pattern, handler)
  const matcher = (pattern, handler) => {
    const bindings = {};

    // Si ya hubo un match previo, ignorar el resto
    if (matched) {
      // Si el patrón es wildcard (_), retornar el resultado (caso final)
      if (pattern === _) return result;
      // Sino, seguir encadenando (ignorar patrones subsecuentes)
      return matcher;
    }

    const matches = checkMatch(value, pattern, bindings);

    if (matches) {
      matched = true;
      result = typeof handler === "function"
        ? handler(bindings, value)
        : handler;

      // Si el pattern es wildcard, es el caso default, retornar resultado
      if (pattern === _) {
        return result;
      }
    }

    // No hay match aún, retornar matcher para encadenar
    return matcher;
  };

  // Permitir acceso directo al resultado mediante conversión
  matcher.valueOf = () => result;
  matcher.toString = () => String(result);
  matcher[Symbol.toPrimitive] = (hint) => {
    if (hint === 'number') return Number(result);
    if (hint === 'string') return String(result);
    return result;
  };

  // API legacy .when()/.else() para compatibilidad
  matcher.when = function(pattern, handler) {
    if (matched) return this;

    const bindings = {};
    const matches = checkMatch(value, pattern, bindings);

    if (matches) {
      matched = true;
      result = typeof handler === "function"
        ? handler(bindings, value)
        : handler;
    }
    return this;
  };

  matcher.else = function(handler) {
    if (!matched) {
      result = typeof handler === "function" ? handler(value) : handler;
    }
    return result;
  };

  return matcher;
};

// Función principal de matching
function checkMatch(value, pattern, bindings) {
  // Wildcard siempre hace match
  if (pattern === _) return true;

  // Función como guard
  if (typeof pattern === "function") {
    return pattern(value);
  }

  // Valores primitivos
  if (typeof pattern !== "object" || pattern === null) {
    return Object.is(value, pattern);
  }

  // Arrays (tuplas)
  if (Array.isArray(pattern)) {
    if (!Array.isArray(value)) return false;
    if (pattern.length !== value.length) return false;

    return pattern.every((p, i) => checkMatch(value[i], p, bindings));
  }

  // Objetos
  if (typeof value !== "object" || value === null) return false;

  for (const key in pattern) {
    const pat = pattern[key];

    // Captura con $variable
    if (typeof pat === "string" && pat.startsWith("$")) {
      const varName = pat.slice(1);
      bindings[varName] = value[key];
      continue;
    }

    // Wildcard en propiedad
    if (pat === _) continue;

    // Matching recursivo
    if (!checkMatch(value[key], pat, bindings)) {
      return false;
    }
  }

  return true;
}
