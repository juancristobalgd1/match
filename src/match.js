const _ = Symbol.for("match-wildcard");

export { _ };

export const match = (value) => {
  let matched = false;
  let result = undefined;

  return {
    when(pattern, handler) {
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
    },

    else(handler) {
      if (!matched) {
        result = typeof handler === "function" ? handler(value) : handler;
      }
      return result;
    }
  };
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
