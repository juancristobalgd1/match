const _ = Symbol.for("match-wildcard");

// Helper for range matching
export const range = (min, max) => (value) =>
  typeof value === "number" && value >= min && value <= max;

export { _ };

export const match = (value, patterns) => {
  // Array syntax: match(value, [[pattern, handler], ...])
  if (Array.isArray(patterns)) {
    const bindings = {};
    for (const [pattern, handler] of patterns) {
      if (checkMatch(value, pattern, bindings)) {
        return typeof handler === "function" ? handler(bindings, value) : handler;
      }
      // Reset bindings for next pattern
      for (const key in bindings) delete bindings[key];
    }
    return undefined;
  }

  // Object syntax: match(value, { 1: "uno", 2: "dos", _: "default" })
  if (patterns && typeof patterns === "object" && !Array.isArray(patterns)) {
    // Try exact match first
    if (patterns.hasOwnProperty(value)) {
      const handler = patterns[value];
      return typeof handler === "function" ? handler({}, value) : handler;
    }
    // Try wildcard
    if (patterns.hasOwnProperty("_") || patterns.hasOwnProperty(_)) {
      const handler = patterns._ !== undefined ? patterns._ : patterns[_];
      return typeof handler === "function" ? handler({}, value) : handler;
    }
    return undefined;
  }

  // Chained syntax: match(value)(pattern, handler)(pattern, handler)
  let matched = false,
    result;

  const matcher = (pattern, handler) => {
    const bindings = {};

    if (matched) return pattern === _ ? result : matcher;

    if (checkMatch(value, pattern, bindings)) {
      matched = true;
      result = typeof handler === "function" ? handler(bindings, value) : handler;
      if (pattern === _) return result;
    }

    return matcher;
  };

  matcher.valueOf = () => result;
  matcher.toString = () => String(result);
  matcher[Symbol.toPrimitive] = (hint) =>
    hint === "number" ? Number(result) : hint === "string" ? String(result) : result;

  return matcher;
};

function checkMatch(value, pattern, bindings) {
  if (pattern === _) return true;
  if (typeof pattern === "function") return pattern(value);
  if (typeof pattern !== "object" || pattern === null)
    return Object.is(value, pattern);
  if (pattern instanceof RegExp)
    return typeof value === "string" && pattern.test(value);

  // Arrays (tuples or OR patterns)
  if (Array.isArray(pattern)) {
    // OR pattern: primitives only, match any
    const isOr = pattern.every(
      (p) =>
        (typeof p !== "object" || p === null) &&
        typeof p !== "function" &&
        (typeof p !== "string" || !p.startsWith("$"))
    );

    if (isOr && !Array.isArray(value)) {
      return pattern.some((p) => Object.is(value, p));
    }

    if (!Array.isArray(value)) return false;

    // Find rest pattern
    let restIdx = -1;
    for (let i = 0; i < pattern.length; i++) {
      if (typeof pattern[i] === "string" && pattern[i].startsWith("...$")) {
        restIdx = i;
        break;
      }
    }

    if (restIdx !== -1) {
      const before = pattern.slice(0, restIdx);
      const after = pattern.slice(restIdx + 1);
      const minLen = before.length + after.length;

      if (value.length < minLen) return false;

      // Match before & after
      for (let i = 0; i < before.length; i++) {
        if (!checkMatch(value[i], before[i], bindings)) return false;
      }
      for (let i = 0; i < after.length; i++) {
        if (
          !checkMatch(value[value.length - after.length + i], after[i], bindings)
        )
          return false;
      }

      // Capture rest
      bindings[pattern[restIdx].slice(4)] = value.slice(
        before.length,
        value.length - after.length
      );
      return true;
    }

    // Normal tuple
    return (
      pattern.length === value.length &&
      pattern.every((p, i) => checkMatch(value[i], p, bindings))
    );
  }

  // Objects
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
