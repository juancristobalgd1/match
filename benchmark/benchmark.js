import { match, _ } from "../src/match.js";

// Benchmark utilities
function benchmark(name, fn, iterations = 1000000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const time = end - start;
  const opsPerSec = (iterations / time) * 1000;

  console.log(`\n${name}`);
  console.log(`  Time: ${time.toFixed(2)}ms`);
  console.log(`  Ops/sec: ${opsPerSec.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);

  return time;
}

console.log("=".repeat(60));
console.log("MATCH-PRO PERFORMANCE BENCHMARKS");
console.log("=".repeat(60));

// Benchmark 1: Simple value matching
console.log("\n📊 Benchmark 1: Simple Value Matching (1M iterations)");
console.log("-".repeat(60));

const simpleValue = 2;

const matchTime = benchmark("match()", () => {
  match(simpleValue)(1, "uno")(2, "dos")(3, "tres")(_, "otro");
});

const switchTime = benchmark("switch", () => {
  let result;
  switch (simpleValue) {
    case 1:
      result = "uno";
      break;
    case 2:
      result = "dos";
      break;
    case 3:
      result = "tres";
      break;
    default:
      result = "otro";
  }
});

console.log(`\n  Ratio: ${(matchTime / switchTime).toFixed(2)}x`);

// Benchmark 2: Object destructuring
console.log("\n📊 Benchmark 2: Object Destructuring (500K iterations)");
console.log("-".repeat(60));

const user = { name: "Ana", role: "admin", age: 28 };

const matchObjTime = benchmark(
  "match() with destructuring",
  () => {
    match(user)({ role: "admin", name: "$n" }, (b) => `Hola ${b.n}`)(
      { role: "user" },
      "Usuario"
    )(_, "Invitado");
  },
  500000
);

const ifElseTime = benchmark(
  "if-else with manual check",
  () => {
    let result;
    if (user.role === "admin") {
      result = `Hola ${user.name}`;
    } else if (user.role === "user") {
      result = "Usuario";
    } else {
      result = "Invitado";
    }
  },
  500000
);

console.log(`\n  Ratio: ${(matchObjTime / ifElseTime).toFixed(2)}x`);

// Benchmark 3: Guards (predicates)
console.log("\n📊 Benchmark 3: Guards/Predicates (500K iterations)");
console.log("-".repeat(60));

const age = 17;

const matchGuardTime = benchmark(
  "match() with guards",
  () => {
    match(age)((x) => x >= 18, "mayor")((x) => x >= 13, "adolescente")(
      _,
      "niño"
    );
  },
  500000
);

const ifElseGuardTime = benchmark(
  "if-else chain",
  () => {
    let result;
    if (age >= 18) {
      result = "mayor";
    } else if (age >= 13) {
      result = "adolescente";
    } else {
      result = "niño";
    }
  },
  500000
);

console.log(`\n  Ratio: ${(matchGuardTime / ifElseGuardTime).toFixed(2)}x`);

// Benchmark 4: Array matching
console.log("\n📊 Benchmark 4: Array Matching (500K iterations)");
console.log("-".repeat(60));

const arr = [1, 999, 3];

const matchArrTime = benchmark(
  "match() with arrays",
  () => {
    match(arr)([1, _, 3], "match")([_, 2, _], "no")(_, "otro");
  },
  500000
);

const manualArrTime = benchmark(
  "manual array check",
  () => {
    let result;
    if (arr.length === 3 && arr[0] === 1 && arr[2] === 3) {
      result = "match";
    } else if (arr.length === 3 && arr[1] === 2) {
      result = "no";
    } else {
      result = "otro";
    }
  },
  500000
);

console.log(`\n  Ratio: ${(matchArrTime / manualArrTime).toFixed(2)}x`);

// Benchmark 5: Complex nested objects
console.log("\n📊 Benchmark 5: Complex Nested Objects (250K iterations)");
console.log("-".repeat(60));

const data = { user: { profile: { role: "admin", city: "Madrid" } } };

const matchNestedTime = benchmark(
  "match() with nested destructuring",
  () => {
    match(data)(
      { user: { profile: { role: "admin", city: "$c" } } },
      (b) => `Admin in ${b.c}`
    )({ user: { profile: { role: "user" } } }, "Regular user")(_, "Guest");
  },
  250000
);

const nestedIfTime = benchmark(
  "nested if-else",
  () => {
    let result;
    if (
      data.user &&
      data.user.profile &&
      data.user.profile.role === "admin"
    ) {
      result = `Admin in ${data.user.profile.city}`;
    } else if (data.user && data.user.profile && data.user.profile.role === "user") {
      result = "Regular user";
    } else {
      result = "Guest";
    }
  },
  250000
);

console.log(`\n  Ratio: ${(matchNestedTime / nestedIfTime).toFixed(2)}x`);

// Benchmark 6: First match optimization
console.log("\n📊 Benchmark 6: First Match Wins (Lazy Evaluation) (1M iterations)");
console.log("-".repeat(60));

let counter = 0;

const lazyMatchTime = benchmark(
  "match() stops at first match",
  () => {
    match(1)(1, () => "first")(1, () => {
      counter++;
      return "second";
    })(_, "default");
  },
  1000000
);

console.log(`  Second handler called: ${counter} times (should be 0)`);

console.log("\n" + "=".repeat(60));
console.log("SUMMARY");
console.log("=".repeat(60));
console.log("\n✅ All benchmarks completed successfully!");
console.log("📝 Note: Ratios show match() overhead vs. native constructs");
console.log("🎯 For most real-world use cases, the overhead is negligible");
console.log("🔥 Benefits: cleaner code, type safety, pattern matching features\n");


