const _ = Symbol.for("match-wildcard");

export const match = (value) => ({
  case: new Proxy(
    {},
    {
      get: (_, pattern) => (handler) => {
        const bindings = {};

        if (pattern === _) {
          return typeof handler === "function"
            ? handler(value, bindings)
            : handler;
        }

        if (typeof pattern === "function") {
          if (pattern(value)) {
            return typeof handler === "function"
              ? handler(value, bindings)
              : handler;
          }
          return () => {};
        }

        if (deepMatch(value, pattern, bindings)) {
          return typeof handler === "function"
            ? handler(value, bindings)
            : handler;
        }

        return () => {};
      },
    }
  ),
});

function deepMatch(value, pattern, bindings) {
  if (pattern === _) return true;
  if (typeof pattern !== "object" || pattern === null)
    return Object.is(value, pattern);

  if (Array.isArray(pattern)) {
    return (
      Array.isArray(value) &&
      pattern.length === value.length &&
      pattern.every((p, i) => deepMatch(value[i], p, bindings))
    );
  }

  if (typeof value !== "object" || value === null) return false;

  for (const key in pattern) {
    const pat = pattern[key];
    if (typeof pat === "string" && pat.startsWith("$")) {
      bindings[pat.slice(1)] = value[key];
      continue;
    }
    if (pat === _) continue;
    if (!deepMatch(value[key], pat, bindings)) return false;
  }
  return true;
}
