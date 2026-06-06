import { describe, test, expect } from "vitest";
import { match, _, or } from "../src/match.js";

describe("match - Snapshot Testing for Complex Patterns", () => {
  test("complex nested object with destructuring and guards", () => {
    const data = {
      user: {
        id: 123,
        profile: {
          name: "John Doe",
          age: 30,
          address: {
            city: "New York",
            zip: "10001"
          }
        },
        roles: ["admin", "user"]
      },
      timestamp: 1619712345,
      status: "active"
    };

    const result = match(data)(
      [
        {
          user: {
            profile: {
              name: "$name",
              age: (age) => age >= 18,
              address: { city: "$city", zip: _ }
            },
            roles: (roles) => roles.includes("admin")
          }
        },
        (b) => `Admin ${b.name} from ${b.city}`
      ],
      [
        {
          user: { profile: { name: "$name", age: _ } },
          roles: _
        },
        (b, value) => `${b.name} has roles: ${value.user.roles.join(", ")}`
      ],
      [{ status: "active" }, "Active user"],
      [_, "Unknown"]
    );

    expect(result).toMatchSnapshot();
  });

  test("array of objects with complex matching", () => {
    const items = [
      { type: "fruit", name: "apple", details: { color: "red", seeds: true } },
      { type: "fruit", name: "banana", details: { color: "yellow", seeds: false } },
      { type: "vehicle", name: "car", details: { wheels: 4, fuel: "gasoline" } },
      { type: "vehicle", name: "bike", details: { wheels: 2, fuel: "human" } }
    ];

    const result = match(items)(
      [
        [
          { type: "fruit", name: "$fruitName", details: { color: "$color", seeds: _ } },
          { type: "fruit", name: _, details: _ }
        ],
        (b) => `${b.fruitName} (${b.color})`
      ],
      [
        [
          { type: "vehicle", details: { wheels: 4 } },
          { type: "vehicle", details: _ }
        ],
        () => "Found four-wheeled vehicles"
      ],
      [_, "No match"]
    );

    expect(result).toMatchSnapshot();
  });

  test("pattern with OR and AND-like usage (using multiple patterns)", () => {
    const value = { a: 5, b: 10, c: 15 };

    const result = match(value)(
      [
        { a: "$a", b: "$b", c: "$c" },
        (b) => b.a + b.b + b.c
      ],
      [
        { a: (a) => a % 2 === 0 },
        "a is even"
      ],
      [
        { b: (b) => b % 5 === 0 },
        "b is multiple of 5"
      ],
      [_, "Neither condition met"]
    );

    expect(result).toMatchSnapshot();
  });

  test("exhaustive matching without _ault should throw", () => {
    expect(() => {
      match(5).exhaustive()([1, "one"], [2, "two"], [3, "three"]);
    }).toThrowErrorMatchingSnapshot();
  });
});
