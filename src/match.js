const _ = Symbol.for("m-w");

export const or = (...patterns) => (value) =>
  patterns.some((p) => Object.is(value, p));

export const throwError = (m) => () => { throw Error(m); };

export { _ };

export const match = (value, ...flat) => {
  if (flat.length) {
    for (let i = 0; i < flat.length - 1; i += 2) {
      const bindings = {};
      if (checkMatch(value, flat[i], bindings)) {
        const h = flat[i + 1];
        return typeof h === "function" ? h(bindings, value) : h;
      }
    }
    return undefined;
  }

  let exhaustive = false;

  const executeMatch = (...cases) => {
    let matched = false;
    let hasDefault = false;
    let result = undefined;

    for (const [pattern, handler] of cases) {
      const bindings = {};
      const isDefault = pattern === _;

      if (isDefault) hasDefault = true;

      const matches = checkMatch(value, pattern, bindings);

      if (matches) {
        matched = true;
        result =
          typeof handler === "function" ? handler(bindings, value) : handler;
        break; // First match wins
      }
    }

    if (exhaustive && !(matched || hasDefault)) {
      throw Error("No match: " + JSON.stringify(value));
    }

    return result;
  };

  executeMatch.exhaustive = () => {
    exhaustive = true;
    return executeMatch;
  };

  return executeMatch;
};

function checkMatch(value, pattern, bindings) {
  if (pattern === _) return true;

  if (typeof pattern === "function") return pattern(value);

  if (typeof pattern !== "object" || pattern === null)
    return Object.is(value, pattern);

  if (Array.isArray(pattern)) {
    if (!Array.isArray(value)) return false;
    if (pattern.length !== value.length) return false;
    return pattern.every((p, i) => checkMatch(value[i], p, bindings));
  }

  if (typeof value !== "object" || value === null) return false;

  for (const key in pattern) {
    const pat = pattern[key];

    if (typeof pat === "string" && pat.startsWith("$")) {
      bindings[pat.slice(1)] = value[key];
      continue;
    }

    if (pat === _) continue;

    if (!checkMatch(value[key], pat, bindings)) return false;
  }

  return true;
}
