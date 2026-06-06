import { describe, test, expect } from "vitest";
import { match, _, or, throwError } from "../src/match.js";

describe("match - Clean Syntax", () => {
  test("basic numbers", () => {
    const result = match(2)(
      [1, "uno"],
      [2, "dos"],
      [3, "tres"],
      [_, "otro"]
    );
    expect(result).toBe("dos");
  });

  test("objects with destructuring", () => {
    const user = { name: "Ana", role: "admin" };
    const result = match(user)(
      [{ role: "admin", name: "$n" }, (b) => `Hola ${b.n}`],
      [{ role: "user" }, "Usuario"],
      [_, "Invitado"]
    );
    expect(result).toBe("Hola Ana");
  });

  test("arrays with wildcards", () => {
    const result = match([1, 999, 3])(
      [[1, _, 3], "match"],
      [[_, 2, _], "no"],
      [_, "otro"]
    );
    expect(result).toBe("match");
  });

  test("guards", () => {
    const result = match(17)(
      [(x) => x >= 18, "mayor"],
      [(x) => x >= 13, "adolescente"],
      [_, "niño"]
    );
    expect(result).toBe("adolescente");
  });

  test("redux actions", () => {
    const action = { type: "ADD_TODO", payload: { text: "test" } };
    const result = match(action)(
      [{ type: "ADD_TODO", payload: { text: "$t" } }, (b) => `Added: ${b.t}`],
      [{ type: "DELETE" }, "Deleted"],
      [_, "Unknown"]
    );
    expect(result).toBe("Added: test");
  });

  test("multiple captures", () => {
    const result = match({ a: 1, b: 2, c: 3 })(
      [{ a: "$x", b: "$y", c: "$z" }, (b) => b.x + b.y + b.z],
      [_, 0]
    );
    expect(result).toBe(6);
  });

  test("nested objects", () => {
    const result = match({ user: { profile: { role: "admin" } } })(
      [{ user: { profile: { role: "admin" } } }, "admin"],
      [_, "no admin"]
    );
    expect(result).toBe("admin");
  });

  test("first match wins", () => {
    let counter = 0;
    const result = match(1)(
      [
        1,
        () => {
          counter++;
          return "first";
        },
      ],
      [
        1,
        () => {
          counter++;
          return "second";
        },
      ],
      [_, "default"]
    );
    expect(result).toBe("first");
    expect(counter).toBe(1);
  });

  test("wildcard as default", () => {
    const result = match(999)([1, "uno"], [2, "dos"], [_, "default"]);
    expect(result).toBe("default");
  });

  test("no match returns undefined", () => {
    const result = match(1)([2, "dos"], [3, "tres"]);
    expect(result).toBe(undefined);
  });

  test("string patterns", () => {
    const result = match("hello")(
      ["world", "mundo"],
      ["hello", "hola"],
      [_, "otro"]
    );
    expect(result).toBe("hola");
  });

  test("null/undefined", () => {
    const result = match(null)(
      [null, "es null"],
      [undefined, "es undefined"],
      [_, "otro"]
    );
    expect(result).toBe("es null");
  });

  test("guards in objects", () => {
    const result = match({ score: 85 })(
      [{ score: (s) => s >= 90 }, "excelente"],
      [{ score: (s) => s >= 70 }, "aprobado"],
      [_, "reprobado"]
    );
    expect(result).toBe("aprobado");
  });

  test("inline in functions", () => {
    const classify = (edad) =>
      match(edad)(
        [(x) => x >= 18, "mayor"],
        [(x) => x >= 13, "adolescente"],
        [_, "niño"]
      );
    const result = classify(15);
    expect(result).toBe("adolescente");
  });

  test("state machine", () => {
    const nextState = (state, event) =>
      match({ state, event })(
        [{ state: "idle", event: "start" }, "loading"],
        [{ state: "loading", event: "success" }, "ready"],
        [{ state: _, event: "reset" }, "idle"],
        [_, state]
      );

    expect(nextState("idle", "start")).toBe("loading");
    expect(nextState("loading", "success")).toBe("ready");
    expect(nextState("ready", "reset")).toBe("idle");
    expect(nextState("loading", "unknown")).toBe("loading");
  });
});

describe("match - Edge Cases", () => {
  test("empty object pattern", () => {
    const result = match({ a: 1 })([{}, "matched"], [_, "not matched"]);
    expect(result).toBe("matched");
  });

  test("empty array pattern", () => {
    const result = match([])(
      [[_, _], "not matched"],
      [[], "matched"],
      [_, "default"]
    );
    expect(result).toBe("matched");
  });

  test("undefined value", () => {
    const result = match(undefined)(
      [null, "null"],
      [undefined, "undefined"],
      [_, "other"]
    );
    expect(result).toBe("undefined");
  });

  test("boolean values", () => {
    const result = match(true)([false, "false"], [true, "true"], [_, "other"]);
    expect(result).toBe("true");
  });

  test("zero and NaN", () => {
    const result1 = match(0)([0, "zero"], [_, "other"]);
    expect(result1).toBe("zero");

    const result2 = match(NaN)([NaN, "NaN"], [_, "other"]);
    expect(result2).toBe("NaN");
  });

  test("negative zero", () => {
    const result = match(-0)(
      [-0, "negative zero"],
      [0, "zero"],
      [_, "other"]
    );
    expect(result).toBe("negative zero");
  });

  test("missing property in object", () => {
    const result = match({ a: 1 })(
      [{ a: 1, b: "$x" }, (b) => `b=${b.x}`],
      [{ a: 1 }, "matched"],
      [_, "not matched"]
    );
    expect(result).toBe("b=undefined");
  });

  test("wildcards in nested objects", () => {
    const result = match({ a: { b: { c: 123 } } })(
      [{ a: { b: { c: _ } } }, "matched"],
      [_, "not matched"]
    );
    expect(result).toBe("matched");
  });

  test("guard returns falsy but not false", () => {
    const result = match(5)(
      [(x) => x > 10 && x, "big number"],
      [(x) => x <= 10, "small"],
      [_, "other"]
    );
    expect(result).toBe("small");
  });

  test("handler as direct primitive value", () => {
    const result = match(1)([1, 42], [2, 84], [_, 0]);
    expect(result).toBe(42);
  });

  test("deeply nested object destructuring", () => {
    const data = {
      user: {
        profile: {
          address: {
            city: "Madrid",
          },
        },
      },
    };
    const result = match(data)(
      [{ user: { profile: { address: { city: "$c" } } } }, (b) => b.c],
      [_, "no match"]
    );
    expect(result).toBe("Madrid");
  });

  test("array with different length doesn't match", () => {
    const result = match([1, 2])(
      [[1, 2, 3], "match"],
      [[1, 2], "exact"],
      [_, "other"]
    );
    expect(result).toBe("exact");
  });

  test("mixed wildcards in arrays", () => {
    const result = match([1, 2, 3, 4])([[1, _, 3, _], "matched"], [_, "not"]);
    expect(result).toBe("matched");
  });

  test("symbols as values", () => {
    const sym = Symbol("test");
    const result = match(sym)([sym, "matched"], [_, "not matched"]);
    expect(result).toBe("matched");
  });

  test("multiple guards", () => {
    const result = match(25)(
      [(x) => x > 100, "very high"],
      [(x) => x > 50, "high"],
      [(x) => x > 20, "medium"],
      [_, "low"]
    );
    expect(result).toBe("medium");
  });
});

describe("match - exhaustive mode", () => {
  test("exhaustive mode throws when no match and no wildcard", () => {
    expect(() => {
      match(42).exhaustive()([1, "one"], [2, "two"]);
    }).toThrow("No match");
  });

  test("exhaustive mode with wildcard doesn't throw", () => {
    const result = match(42).exhaustive()(
      [1, "one"],
      [2, "two"],
      [_, "default"]
    );
    expect(result).toBe("default");
  });

  test("exhaustive mode with match doesn't throw", () => {
    const result = match(1).exhaustive()([1, "one"], [2, "two"]);
    expect(result).toBe("one");
  });

  test("exhaustive mode error includes value", () => {
    expect(() => {
      match({ x: 42 }).exhaustive()([{ x: 1 }, "one"]);
    }).toThrow('{"x":42}');
  });

  test("exhaustive can be chained before patterns", () => {
    const result = match(1).exhaustive()([1, "matched"], [_, "default"]);
    expect(result).toBe("matched");
  });

  test("exhaustive mode with complex object", () => {
    const data = { user: { role: "admin" } };
    const result = match(data).exhaustive()(
      [{ user: { role: "admin" } }, "admin"],
      [_, "other"]
    );
    expect(result).toBe("admin");
  });

  test("wildcard in object properties", () => {
    const result = match({ role: "admin", perms: ["read"] })(
      [{ role: "admin", perms: _ }, "admin with perms"],
      [_, "other"]
    );
    expect(result).toBe("admin with perms");
  });

  test("wildcard in arrays", () => {
    const result = match([1, 2, 3])(
      [[1, _, 3], "matched"],
      [_, "default"]
    );
    expect(result).toBe("matched");
  });
});

describe("match - OR patterns", () => {
  test("or with numbers", () => {
    const result = match(2)(
      [or(1, 2, 3), "one two or three"],
      [or(4, 5), "four or five"],
      [_, "other"]
    );
    expect(result).toBe("one two or three");
  });

  test("or with strings", () => {
    const result = match("hello")(
      [or("hi", "hello", "hey"), "greeting"],
      [or("bye", "goodbye"), "farewell"],
      [_, "other"]
    );
    expect(result).toBe("greeting");
  });

  test("or with no match", () => {
    const result = match(10)(
      [or(1, 2, 3), "matched"],
      [_, "not matched"]
    );
    expect(result).toBe("not matched");
  });

  test("or with mixed types", () => {
    const result = match("1")(
      [or(1, "1", true), "matched"],
      [_, "not matched"]
    );
    expect(result).toBe("matched");
  });

  test("or with null and undefined", () => {
    const result1 = match(null)(
      [or(null, undefined), "nullish"],
      [_, "other"]
    );
    expect(result1).toBe("nullish");

    const result2 = match(undefined)(
      [or(null, undefined), "nullish"],
      [_, "other"]
    );
    expect(result2).toBe("nullish");
  });

  test("or with single value", () => {
    const result = match(42)(
      [or(42), "matched"],
      [_, "not matched"]
    );
    expect(result).toBe("matched");
  });

  test("or combined with other patterns", () => {
    const result = match({ status: 404 })(
      [{ status: or(200, 201) }, "success"],
      [{ status: or(400, 404, 500) }, "error"],
      [_, "unknown"]
    );
    expect(result).toBe("error");
  });

  test("HTTP status codes example", () => {
    const getStatusType = (code) =>
      match(code)(
        [or(200, 201, 204), "success"],
        [or(400, 401, 403, 404), "client error"],
        [or(500, 502, 503), "server error"],
        [_, "unknown"]
      );

    expect(getStatusType(200)).toBe("success");
    expect(getStatusType(201)).toBe("success");
    expect(getStatusType(404)).toBe("client error");
    expect(getStatusType(500)).toBe("server error");
    expect(getStatusType(999)).toBe("unknown");
  });
});

describe("match - Error helpers (PHP-style)", () => {
  test("throwError throws error when matched", () => {
    expect(() => {
      match(true)(
        [true, throwError("Something went wrong")],
        [_, "default"]
      );
    }).toThrow("Something went wrong");
  });

  test("throwError doesn't throw if not matched", () => {
    const result = match(false)(
      [true, throwError("Should not throw")],
      [_, "default"]
    );
    expect(result).toBe("default");
  });

  test("throwError doesn't throw on non-matching pattern", () => {
    const result = match("valid")(
      ["invalid", throwError("Invalid input")],
      [_, "valid"]
    );
    expect(result).toBe("valid");
  });

  test("PHP-style redirector example", () => {
    let cyclic = 0;
    const isValidURL = (url) => /^https?:\/\/.+/.test(url);

    const redirector = (page = null, maxRedirects = 10) =>
      match(true)(
        [page === null, () => "reload"],
        [!isValidURL(page), throwError("The URL provided is invalid.")],
        [++cyclic > maxRedirects, throwError("Cyclic routing detected")],
        [_, () => `Location: ${page}`]
      );

    // Valid URL
    expect(redirector("https://example.com")).toBe("Location: https://example.com");

    // null page
    expect(redirector(null)).toBe("reload");

    // Invalid URL
    expect(() => redirector("not-a-url")).toThrow("The URL provided is invalid.");

    // Cyclic routing (cyclic is already 1 from valid URL test)
    cyclic = 10;
    expect(() => redirector("https://example.com", 10)).toThrow("Cyclic routing detected");
  });

  test("conditional error throwing with guards", () => {
    const validateAge = (age) =>
      match(age)(
        [(x) => x < 0, throwError("Age cannot be negative")],
        [(x) => x > 150, throwError("Age seems unrealistic")],
        [(x) => x >= 18, "Adult"],
        [_, "Minor"]
      );

    expect(validateAge(25)).toBe("Adult");
    expect(validateAge(15)).toBe("Minor");
    expect(() => validateAge(-5)).toThrow("Age cannot be negative");
    expect(() => validateAge(200)).toThrow("Age seems unrealistic");
  });

  test("HTTP status validation", () => {
    const handleStatus = (status) =>
      match(status)(
        [or(200, 201, 204), "Success"],
        [or(400, 404), throwError("Client error occurred")],
        [or(500, 502, 503), throwError("Server error occurred")],
        [_, throwError("Unknown status code")]
      );

    expect(handleStatus(200)).toBe("Success");
    expect(() => handleStatus(404)).toThrow("Client error occurred");
    expect(() => handleStatus(500)).toThrow("Server error occurred");
    expect(() => handleStatus(999)).toThrow("Unknown status code");
  });

  test("nested match with error throwing", () => {
    const process = (data) =>
      match(data)(
        [{ type: "user", role: "$r" }, (b) =>
          match(b.r)(
            ["admin", "Admin access"],
            ["user", "User access"],
            [_, throwError("Unknown role")]
          )
        ],
        [_, throwError("Invalid data structure")]
      );

    expect(process({ type: "user", role: "admin" })).toBe("Admin access");
    expect(() => process({ type: "user", role: "unknown" })).toThrow("Unknown role");
    expect(() => process({ invalid: true })).toThrow("Invalid data structure");
  });
});

describe("match - Flat API", () => {
  test("basic value matching", () => {
    expect(match(0, 0, "zero", 1, "one", 42, "the answer")).toBe("zero");
    expect(match(1, 0, "zero", 1, "one", 42, "the answer")).toBe("one");
    expect(match(42, 0, "zero", 1, "one", 42, "the answer")).toBe("the answer");
  });

  test("wildcard as default", () => {
    expect(match(99, 0, "zero", 1, "one", _, "other")).toBe("other");
  });

  test("no match returns undefined", () => {
    expect(match(99, 0, "zero", 1, "one")).toBe(undefined);
  });

  test("guard predicate", () => {
    const result = match(17,
      (x) => x >= 18, "adult",
      (x) => x >= 13, "teenager",
      _, "child"
    );
    expect(result).toBe("teenager");
  });

  test("object pattern with capture", () => {
    const user = { name: "Ana", role: "admin" };
    const result = match(user,
      { role: "admin", name: "$n" }, (b) => `Hello ${b.n}`,
      { role: "user",  name: "$n" }, (b) => `Hi ${b.n}`,
      _, "guest"
    );
    expect(result).toBe("Hello Ana");
  });

  test("or pattern", () => {
    expect(match(404, or(200, 201), "success", or(400, 404), "client error", _, "other")).toBe("client error");
  });

  test("throwError in flat mode", () => {
    expect(() => match(null, null, throwError("null not allowed"), _, "ok")).toThrow("null not allowed");
  });

  test("one-liner expression", () => {
    const classify = (n) => match(n, (x) => x >= 18, "adult", (x) => x >= 13, "teen", _, "child");
    expect(classify(20)).toBe("adult");
    expect(classify(15)).toBe("teen");
    expect(classify(5)).toBe("child");
  });

  test("array mode still works after flat addition", () => {
    const result = match(2)(
      [1, "one"],
      [2, "two"],
      [_, "other"]
    );
    expect(result).toBe("two");
  });
});
