const _ = Symbol.for("m-wild");
const DEFAULT = Symbol.for("m-def");

export { _, DEFAULT as default };

export const match = (value) => {
  let matched = false;
  let hasDefault = false;
  let exhaustive = false;
  let result = undefined;

  const matcher = (pattern, handler) => {
    const bindings = {};

    if (matched) {
      if (pattern === _ || pattern === DEFAULT) return result;
      return matcher;
    }

    const isDefault = pattern === _ || pattern === DEFAULT;
    if (isDefault) hasDefault = true;

    const matches = checkMatch(value, pattern, bindings);

    if (matches) {
      matched = true;
      result =
        typeof handler === "function" ? handler(bindings, value) : handler;
      if (isDefault) return result;
    }

    return matcher;
  };

  matcher.exhaustive = () => {
    exhaustive = true;
    return matcher;
  };

  const checkExhaustive = () => {
    if (exhaustive && !(matched || hasDefault)) {
      throw Error("No match: " + JSON.stringify(value));
    }
    return result;
  };

  matcher.valueOf = () => checkExhaustive();

  matcher.toString = () => String(checkExhaustive());

  matcher[Symbol.toPrimitive] = (hint) => {
    const res = checkExhaustive();
    if (hint === "number") return Number(res);
    if (hint === "string") return String(res);
    return res;
  };

  return matcher;
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
