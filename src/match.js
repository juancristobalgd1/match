const _ = Symbol.for("match-wildcard");

export { _ };

export const match = (value) => {
  let matched = false;

  let result = undefined;

  // Matcher function that can be called directly: match(x)(pattern, handler)
  const matcher = (pattern, handler) => {
    const bindings = {};

    // If there has already been a previous match, ignore the rest.

    if (matched) {
      // If the pattern is a wildcard (_), return the result (final case)

      if (pattern === _) return result;

      // Otherwise, continue chaining (ignore subsequent patterns)

      return matcher;
    }

    const matches = checkMatch(value, pattern, bindings);

    if (matches) {
      matched = true;

      result =
        typeof handler === "function" ? handler(bindings, value) : handler;

      //If the pattern is a wildcard, which is the default case, return the result.

      if (pattern === _) return result;
    }

    // No match yet, return matcher to chain

    return matcher;
  };

  // Allow direct access to the result through conversion

  matcher.valueOf = () => result;

  matcher.toString = () => String(result);

  matcher[Symbol.toPrimitive] = (hint) => {
    if (hint === "number") return Number(result);
    if (hint === "string") return String(result);

    return result;
  };

  return matcher;
};

// Main function of matching

function checkMatch(value, pattern, bindings) {
  // Wildcard always matches
  if (pattern === _) return true;

  //Function as guard
  if (typeof pattern === "function") return pattern(value);

  // Primitive values
  if (typeof pattern !== "object" || pattern === null)
    return Object.is(value, pattern);

  // Arrays (tuples)
  if (Array.isArray(pattern)) {
    if (!Array.isArray(value)) return false;
    if (pattern.length !== value.length) return false;
    return pattern.every((p, i) => checkMatch(value[i], p, bindings));
  }

  // Objects
  if (typeof value !== "object" || value === null) return false;

  for (const key in pattern) {
    const pat = pattern[key];

    // Capture with $variable

    if (typeof pat === "string" && pat.startsWith("$")) {
      const varName = pat.slice(1);

      bindings[varName] = value[key];

      continue;
    }

    // Wildcard in property

    if (pat === _) continue;

    // Matching recursively

    if (!checkMatch(value[key], pat, bindings)) return false;
  }

  return true;
}
