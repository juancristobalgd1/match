import { describe, test, expect } from "vitest";
import { match, _ } from "../src/match.js";

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
