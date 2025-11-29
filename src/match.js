const _ = Symbol.for("m-wild");
const DEFAULT = Symbol.for("m-def");

// OR pattern helper: match if value equals any of the patterns
export const or = (...patterns) => (value) =>
  patterns.some((p) => Object.is(value, p));

// Error helper: throw errors in match expressions (like PHP 8.0+)
const throwFn = (m) => () => {
  throw Error(m);
};
export const throwError = throwFn;
export const fail = throwFn;
export const panic = throwFn;

export { _, DEFAULT as def };

export const match = (value) => {
  let exhaustive = false;

  const executeMatch = (...cases) => {
    let matched = false;
    let hasDefault = false;
    let result = undefined;

    for (const [pattern, handler] of cases) {
      const bindings = {};
      const isDefault = pattern === _ || pattern === DEFAULT;

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
  if (pattern === _ || pattern === DEFAULT) return true;

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

    if (pat === _ || pat === DEFAULT) continue;

    if (!checkMatch(value[key], pat, bindings)) return false;
  }

  return true;
}
