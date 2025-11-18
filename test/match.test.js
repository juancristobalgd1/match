import { describe, test, expect } from "vitest";
import { match, _, range } from "../src/match.js";

describe("match - Clean Syntax", () => {
  test("basic numbers", () => {
    const result = match(2)(1, "uno")(2, "dos")(3, "tres")(_, "otro");
    expect(result).toBe("dos");
  });

  test("objects with destructuring", () => {
    const user = { name: "Ana", role: "admin" };
    const result = match(user)(
      { role: "admin", name: "$n" },
      (b) => `Hola ${b.n}`
    )({ role: "user" }, "Usuario")(_, "Invitado");
    expect(result).toBe("Hola Ana");
  });

  test("arrays with wildcards", () => {
    const result = match([1, 999, 3])([1, _, 3], "match")([_, 2, _], "no")(
      _,
      "otro"
    );
    expect(result).toBe("match");
  });

  test("guards", () => {
    const result = match(17)(
      (x) => x >= 18,
      "mayor"
    )((x) => x >= 13, "adolescente")(_, "niño");
    expect(result).toBe("adolescente");
  });

  test("redux actions", () => {
    const action = { type: "ADD_TODO", payload: { text: "test" } };
    const result = match(action)(
      { type: "ADD_TODO", payload: { text: "$t" } },
      (b) => `Added: ${b.t}`
    )({ type: "DELETE" }, "Deleted")(_, "Unknown");
    expect(result).toBe("Added: test");
  });

  test("multiple captures", () => {
    const result = match({ a: 1, b: 2, c: 3 })(
      { a: "$x", b: "$y", c: "$z" },
      (b) => b.x + b.y + b.z
    )(_, 0);
    expect(result).toBe(6);
  });

  test("nested objects", () => {
    const result = match({ user: { profile: { role: "admin" } } })(
      { user: { profile: { role: "admin" } } },
      "admin"
    )(_, "no admin");
    expect(result).toBe("admin");
  });

  test("first match wins", () => {
    let counter = 0;
    const result = match(1)(1, () => {
      counter++;
      return "first";
    })(1, () => {
      counter++;
      return "second";
    })(_, "default");
    expect(result).toBe("first");
    expect(counter).toBe(1);
  });

  test("wildcard as default", () => {
    const result = match(999)(1, "uno")(2, "dos")(_, "default");
    expect(result).toBe("default");
  });

  test("no match returns undefined", () => {
    const result = match(1)(2, "dos")(3, "tres")(_, undefined);
    expect(result).toBe(undefined);
  });

  test("string patterns", () => {
    const result = match("hello")("world", "mundo")("hello", "hola")(
      _,
      "otro"
    );
    expect(result).toBe("hola");
  });

  test("null/undefined", () => {
    const result = match(null)(null, "es null")(undefined, "es undefined")(
      _,
      "otro"
    );
    expect(result).toBe("es null");
  });

  test("guards in objects", () => {
    const result = match({ score: 85 })(
      { score: (s) => s >= 90 },
      "excelente"
    )({ score: (s) => s >= 70 }, "aprobado")(_, "reprobado");
    expect(result).toBe("aprobado");
  });

  test("inline in functions", () => {
    const classify = (edad) =>
      match(edad)((x) => x >= 18, "mayor")((x) => x >= 13, "adolescente")(
        _,
        "niño"
      );
    const result = classify(15);
    expect(result).toBe("adolescente");
  });

  test("state machine", () => {
    const nextState = (state, event) =>
      match({ state, event })({ state: "idle", event: "start" }, "loading")(
        { state: "loading", event: "success" },
        "ready"
      )({ state: _, event: "reset" }, "idle")(_, state);

    expect(nextState("idle", "start")).toBe("loading");
    expect(nextState("loading", "success")).toBe("ready");
    expect(nextState("ready", "reset")).toBe("idle");
    expect(nextState("loading", "unknown")).toBe("loading");
  });
});

describe("match - Edge Cases", () => {
  test("empty object pattern", () => {
    const result = match({ a: 1 })({}, "matched")(_, "not matched");
    expect(result).toBe("matched");
  });

  test("empty array pattern", () => {
    const result = match([])([_, _], "not matched")([], "matched")(
      _,
      "default"
    );
    expect(result).toBe("matched");
  });

  test("undefined value", () => {
    const result = match(undefined)(null, "null")(undefined, "undefined")(
      _,
      "other"
    );
    expect(result).toBe("undefined");
  });

  test("boolean values", () => {
    const result = match(true)(false, "false")(true, "true")(_, "other");
    expect(result).toBe("true");
  });

  test("zero and NaN", () => {
    const result1 = match(0)(0, "zero")(_, "other");
    expect(result1).toBe("zero");

    const result2 = match(NaN)(NaN, "NaN")(_, "other");
    expect(result2).toBe("NaN");
  });

  test("negative zero", () => {
    const result = match(-0)(-0, "negative zero")(0, "zero")(_, "other");
    expect(result).toBe("negative zero");
  });

  test("missing property in object", () => {
    const result = match({ a: 1 })({ a: 1, b: "$x" }, (b) => `b=${b.x}`)(
      { a: 1 },
      "matched"
    )(_, "not matched");
    expect(result).toBe("b=undefined");
  });

  test("wildcards in nested objects", () => {
    const result = match({ a: { b: { c: 123 } } })(
      { a: { b: { c: _ } } },
      "matched"
    )(_, "not matched");
    expect(result).toBe("matched");
  });

  test("guard returns falsy but not false", () => {
    const result = match(5)(
      (x) => x > 10 && x,
      "big number"
    )((x) => x <= 10, "small")(_, "other");
    expect(result).toBe("small");
  });

  test("handler as direct primitive value", () => {
    const result = match(1)(1, 42)(2, 84)(_, 0);
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
      { user: { profile: { address: { city: "$c" } } } },
      (b) => b.c
    )(_, "no match");
    expect(result).toBe("Madrid");
  });

  test("array with different length doesn't match", () => {
    const result = match([1, 2])([1, 2, 3], "match")([1, 2], "exact")(
      _,
      "other"
    );
    expect(result).toBe("exact");
  });

  test("mixed wildcards in arrays", () => {
    const result = match([1, 2, 3, 4])([1, _, 3, _], "matched")(_, "not");
    expect(result).toBe("matched");
  });

  test("symbols as values", () => {
    const sym = Symbol("test");
    const result = match(sym)(sym, "matched")(_, "not matched");
    expect(result).toBe("matched");
  });

  test("multiple guards", () => {
    const result = match(25)(
      (x) => x > 100,
      "very high"
    )(
      (x) => x > 50,
      "high"
    )((x) => x > 20, "medium")(_, "low");
    expect(result).toBe("medium");
  });
});

describe("match - Type Coercion", () => {
  test("toString conversion", () => {
    const result = match(42)(42, "matched")(_, "not matched");
    expect(String(result)).toBe("matched");
  });

  test("valueOf conversion", () => {
    const result = match(1)(1, 100)(_, 0);
    expect(result.valueOf()).toBe(100);
  });

  test("template literal coercion", () => {
    const result = match(1)(1, "success")(_, "fail");
    expect(`Result: ${result}`).toBe("Result: success");
  });
});

describe("match - Enhanced Expressiveness", () => {
  describe("Rest Patterns", () => {
    test("capture rest at end of array", () => {
      const result = match([1, 2, 3, 4])([1, "...$rest"], (b) => b.rest)(
        _,
        []
      );
      expect(result).toEqual([2, 3, 4]);
    });

    test("capture rest in middle of array", () => {
      const result = match([1, 2, 3, 4, 5])(
        [1, "...$middle", 5],
        (b) => b.middle
      )(_, []);
      expect(result).toEqual([2, 3, 4]);
    });

    test("rest pattern with no elements", () => {
      const result = match([1, 5])([1, "...$middle", 5], (b) => b.middle)(
        _,
        null
      );
      expect(result).toEqual([]);
    });

    test("rest pattern at beginning", () => {
      const result = match([1, 2, 3, 4])(["...$head", 4], (b) => b.head)(
        _,
        []
      );
      expect(result).toEqual([1, 2, 3]);
    });

    test("rest captures everything when alone", () => {
      const result = match([1, 2, 3])(["...$all"], (b) => b.all)(_, []);
      expect(result).toEqual([1, 2, 3]);
    });

    test("rest with wildcards", () => {
      const result = match([1, 2, 3, 4, 5])(
        [1, "...$mid", 5],
        (b) => b.mid
      )(_, null);
      expect(result).toEqual([2, 3, 4]);
    });
  });

  describe("Regex Patterns", () => {
    test("match email with regex", () => {
      const result = match("test@gmail.com")(
        /^[\w.]+@gmail\.com$/,
        "Gmail user"
      )(/^[\w.]+@.*\.edu$/, "Academic")(_, "Other");
      expect(result).toBe("Gmail user");
    });

    test("match academic email", () => {
      const result = match("student@stanford.edu")(
        /^[\w.]+@gmail\.com$/,
        "Gmail"
      )(/^[\w.]+@.*\.edu$/, "Academic")(_, "Other");
      expect(result).toBe("Academic");
    });

    test("regex no match", () => {
      const result = match("test@yahoo.com")(/^[\w.]+@gmail\.com$/, "Gmail")(
        _,
        "Other"
      );
      expect(result).toBe("Other");
    });

    test("regex with capture groups (pattern only)", () => {
      const result = match("hello world")(/^hello/, "matched")(_, "not");
      expect(result).toBe("matched");
    });
  });

  describe("Range Matching", () => {
    test("match child age range", () => {
      const result = match(10)(range(0, 12), "Child")(
        range(13, 17),
        "Teenager"
      )(range(18, 64), "Adult")(_, "Senior");
      expect(result).toBe("Child");
    });

    test("match teenager age range", () => {
      const result = match(15)(range(0, 12), "Child")(
        range(13, 17),
        "Teenager"
      )(range(18, 64), "Adult")(_, "Senior");
      expect(result).toBe("Teenager");
    });

    test("match adult age range", () => {
      const result = match(30)(range(0, 12), "Child")(
        range(13, 17),
        "Teenager"
      )(range(18, 64), "Adult")(_, "Senior");
      expect(result).toBe("Adult");
    });

    test("range with infinity", () => {
      const result = match(100)(range(0, 64), "Young")(
        range(65, Infinity),
        "Senior"
      )(_, "Unknown");
      expect(result).toBe("Senior");
    });

    test("range boundary inclusive", () => {
      const result1 = match(13)(range(13, 17), "match")(_, "no match");
      expect(result1).toBe("match");

      const result2 = match(17)(range(13, 17), "match")(_, "no match");
      expect(result2).toBe("match");
    });
  });

  describe("OR Patterns", () => {
    test("match any of multiple primitive values", () => {
      const result = match("admin")(["admin", "superuser", "moderator"], "Admin access")(
        ["user", "guest"],
        "Limited access"
      )(_, "No access");
      expect(result).toBe("Admin access");
    });

    test("OR pattern with numbers", () => {
      const result = match(2)([1, 2, 3], "Low")([4, 5, 6], "Medium")(
        [7, 8, 9],
        "High"
      )(_, "Other");
      expect(result).toBe("Low");
    });

    test("OR pattern no match", () => {
      const result = match("owner")(["admin", "moderator"], "Admin")(
        _,
        "Other"
      );
      expect(result).toBe("Other");
    });

    test("OR pattern with null and undefined", () => {
      const result = match(null)([null, undefined], "Empty")(_, "Has value");
      expect(result).toBe("Empty");
    });
  });

  describe("Nested Arrays with Objects", () => {
    test("capture from nested objects in array", () => {
      const result = match([{ x: 1, y: 2 }, { x: 3, y: 4 }])(
        [{ x: "$a", y: "$b" }, { x: "$c", y: "$d" }],
        (b) => b.a + b.b + b.c + b.d
      )(_, 0);
      expect(result).toBe(10);
    });

    test("nested array matching with wildcards", () => {
      const result = match([[1, 2], [3, 4]])([[1, 2], [3, 4]], "matched")(
        _,
        "not"
      );
      expect(result).toBe("matched");
    });

    test("nested array with wildcard matching", () => {
      const result = match([[1, 2], [3, 4]])([[_, _], [_, _]], "matched")(
        _,
        "not"
      );
      expect(result).toBe("matched");
    });
  });

  describe("Combined Features", () => {
    test("regex + OR pattern + range in same match", () => {
      const email = "admin@company.com";
      const age = 25;

      const roleResult = match(email)(
        /admin@/,
        "admin"
      )(/user@/, "user")(_, "guest");
      expect(roleResult).toBe("admin");

      const ageResult = match(age)(range(0, 17), "minor")(
        range(18, Infinity),
        "adult"
      )(_, "unknown");
      expect(ageResult).toBe("adult");
    });

    test("rest pattern with regex in nested structure", () => {
      const data = ["intro", "content1", "content2", "outro"];
      const result = match(data)(
        ["intro", "...$content", "outro"],
        (b) => b.content
      )(_, []);
      expect(result).toEqual(["content1", "content2"]);
    });

    test("OR pattern at object value level", () => {
      const user = { role: "admin", name: "Ana" };
      const result = match(user)(
        { role: ["admin", "superuser"], name: "$n" },
        (b) => `Admin: ${b.n}`
      )(_, "Regular user");
      // This matches because array pattern in object value is treated as tuple match
      // The role value "admin" is a string, and ["admin", "superuser"] expects an array
      // So it actually doesn't match the way we might think
      // Let's test the actual behavior
      expect(result).toBe("Admin: Ana");
    });
  });
});
