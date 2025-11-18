# CLAUDE.md - AI Assistant Guide for match-pro

**Last Updated:** 2025-11-18
**Project Version:** 1.0.0
**Repository:** https://github.com/juancristobalgd1/match

---

## Project Overview

**match-pro** is an elegant, lightweight pattern matching library for JavaScript with zero dependencies and < 1 KB size. It provides Rust-style pattern matching with a clean, chainable syntax.

### Key Characteristics
- **Size:** 773 bytes minified (< 1 KB requirement)
- **Dependencies:** Zero production dependencies
- **Language:** Pure JavaScript (ES2015+) with TypeScript support
- **Test Coverage:** 33 tests with 100% pass rate
- **Performance:** Zero-copy, lazy evaluation architecture

---

## Repository Structure

```
/home/user/match/
├── src/
│   ├── match.js           # Core implementation (107 lines) - THE HEART OF THE LIBRARY
│   └── match.d.ts         # TypeScript type definitions (41 lines)
├── test/
│   └── match.test.js      # Test suite (264 lines, 33 tests)
├── examples/
│   └── typescript-example.ts  # TypeScript usage examples
├── benchmark/
│   └── benchmark.js       # Performance benchmarks
├── dist/
│   └── match.min.js       # Minified production build (773 bytes)
├── .github/workflows/
│   └── ci.yml             # CI/CD pipeline (Node 18.x, 20.x, 22.x)
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
├── match.d.ts             # Root type definitions (with namespace export)
├── README.md              # User-facing documentation
├── LICENSE                # MIT License
└── CLAUDE.md              # This file (AI assistant guide)
```

### Critical Files to Understand

1. **`src/match.js`** - The entire library implementation
   - 107 lines of pure JavaScript
   - Exports: `match()` function and `_` wildcard symbol
   - Contains: `checkMatch()` recursive pattern matcher

2. **`test/match.test.js`** - Comprehensive test suite
   - 3 suites: Basic Functionality, Edge Cases, Type Coercion
   - 33 tests covering all use cases
   - Use as reference for expected behavior

3. **`package.json`** - Project metadata and scripts
   - Entry points: main (dist), module (src), types (src)
   - 5 npm scripts for common tasks

---

## Core Architecture

### Pattern Matching Implementation

The library uses a **chainable builder pattern**:

```javascript
match(value)(pattern1, handler1)(pattern2, handler2)(_, default)
```

### Key Design Patterns

1. **Closure-Based Matcher** (`src/match.js:5-58`)
   - `match(value)` returns a matcher function
   - Tracks `matched` state to implement lazy evaluation
   - First match wins, subsequent patterns ignored

2. **Recursive Pattern Matching** (`src/match.js:62-106`)
   - `checkMatch(value, pattern, bindings)` recursively traverses structures
   - Handles: primitives, functions (guards), arrays, objects
   - Collects captures in `bindings` object

3. **Symbol-Based Wildcard** (`src/match.js:1`)
   - `Symbol.for("match-wildcard")` prevents collisions
   - Exported as `_` for clean syntax

4. **Type Coercion Protocol** (`src/match.js:44-55`)
   - `valueOf()`, `toString()`, `[Symbol.toPrimitive]`
   - Enables automatic result extraction

### Pattern Types Supported

| Pattern | Example | Matching Logic | Line Reference |
|---------|---------|----------------|----------------|
| Wildcard | `_` | Always matches | `match.js:64` |
| Function (Guard) | `x => x >= 18` | Calls function with value | `match.js:67` |
| Primitive | `1`, `"hello"`, `null` | `Object.is()` comparison | `match.js:70-71` |
| Array | `[1, _, 3]` | Length + element-wise match | `match.js:74-78` |
| Object | `{ role: "admin" }` | Property subset match | `match.js:83-103` |
| Capture | `{ name: "$n" }` | Extracts to bindings | `match.js:88-94` |

### Capture Mechanism

**Syntax:** `"$variableName"` as a property value in object patterns

**Example:**
```javascript
match({ name: "Ana", age: 28 })(
  { name: "$n", age: "$a" },
  (bindings) => `${bindings.n} is ${bindings.a}`
)
// bindings = { n: "Ana", a: 28 }
```

**Implementation:** `src/match.js:88-94`

---

## Development Workflow

### Setup

```bash
npm install        # Install devDependencies (terser, typescript, vitest)
```

### Development Commands

```bash
# Testing
npm test                  # Run all tests once (vitest run)
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report

# Building
npm run build            # Minify src/match.js → dist/match.min.js
                         # Uses: terser src/match.js -c -m -o dist/match.min.js

# Benchmarking
npm run bench            # Run performance benchmarks
```

### TypeScript Type Checking

```bash
npx tsc --noEmit         # Type check without emitting files
```

**Note:** TypeScript is only used for type checking, not transpilation. The library is pure JavaScript.

---

## Testing Conventions

### Framework: Vitest 4.0.10

### Test Structure (`test/match.test.js`)

**Suite 1: "match - Clean Syntax"** (12 tests)
- Basic functionality and common use cases
- Lines: 4-87

**Suite 2: "match - Edge Cases"** (11 tests)
- Boundary conditions and corner cases
- Lines: 89-184

**Suite 3: "match - Type Coercion"** (3 tests)
- toString(), valueOf(), template literals
- Lines: 186-204

### Writing Tests

**Pattern:**
```javascript
test("description", () => {
  const result = match(value)(pattern1, handler1)(_, default);
  expect(result).toBe(expected);
});
```

**Important Testing Patterns:**

1. **Lazy Evaluation Testing**
   ```javascript
   let counter = 0;
   match(1)(1, () => { counter++; return "first"; })(1, () => { counter++; return "second"; });
   expect(counter).toBe(1); // Second handler never called
   ```

2. **Edge Cases to Always Test**
   - Empty objects: `{}`
   - Empty arrays: `[]`
   - `null` and `undefined`
   - `NaN` and `-0`
   - Symbols
   - Missing object properties
   - Array length mismatches

---

## Key Conventions for AI Assistants

### 1. Size Constraint - CRITICAL

**The minified build MUST be < 1024 bytes (1 KB)**

- Current size: 773 bytes ✓
- Buffer: 251 bytes
- CI/CD enforces this constraint (`.github/workflows/ci.yml:36-43`)

**Before adding ANY new feature:**
1. Run `npm run build`
2. Check `wc -c < dist/match.min.js`
3. Ensure result < 1024 bytes

### 2. Zero Dependencies - CRITICAL

**NO production dependencies allowed**

- Current: 0 deps ✓
- Only devDependencies permitted (terser, typescript, vitest)
- DO NOT suggest adding lodash, ramda, or any utility library

### 3. Code Style and Patterns

**Follow existing patterns in `src/match.js`:**

- Use closures for state management
- Recursive functions for nested matching
- Symbol-based constants for special values
- No classes - functional programming style
- ES2015+ features only (no bleeding edge syntax)

**Comments:**
- Use clear, concise comments
- Existing style: `// Comment` (single line)
- Comment above complex logic blocks

### 4. TypeScript Definitions

**Always update BOTH type definition files:**
- `src/match.d.ts` - Main definitions
- `match.d.ts` - Root-level copy with namespace export

**Pattern:**
```typescript
export type Handler<T, R> = ((bindings: Bindings, value: T) => R) | R;
export interface Matcher<T, R = any> {
  (pattern: any, handler: Handler<T, R>): Matcher<T, R>;
  valueOf(): R | undefined;
  toString(): string;
  [Symbol.toPrimitive](hint: string): any;
}
```

### 5. Performance Considerations

**Lazy Evaluation:**
- First match wins, stop immediately
- Never evaluate subsequent handlers
- Implementation: `src/match.js:16-24`

**Zero-Copy:**
- Never clone objects or arrays
- Direct property access only
- Recursive traversal without copying

**Avoid:**
- `JSON.parse(JSON.stringify(...))` for deep clones
- `Object.assign()` or spread operators for copying
- Array methods that create new arrays unnecessarily

### 6. Testing Requirements

**For ANY code change:**

1. **Add tests** for new behavior
2. **Test edge cases** (null, undefined, empty objects/arrays)
3. **Verify lazy evaluation** still works
4. **Check type coercion** (valueOf, toString)
5. **Run full suite:** `npm test`

**Test must:**
- Pass 100% (33/33 or more)
- Execute quickly (< 100ms for full suite)
- Use Vitest's `describe`, `test`, `expect` API

### 7. Documentation Updates

**When changing behavior, update:**

1. `README.md` - User-facing documentation
2. `src/match.d.ts` - Type definitions
3. `match.d.ts` - Root type definitions
4. `examples/typescript-example.ts` - If relevant
5. `CLAUDE.md` - This file (if architecture changes)

### 8. Common Pitfalls to Avoid

**DO NOT:**
- Add dependencies to `package.json` (production)
- Increase minified size beyond 1 KB
- Break lazy evaluation (first match wins)
- Change the clean syntax API
- Remove TypeScript support
- Add breaking changes to public API

**DO:**
- Maintain backward compatibility
- Add tests for all changes
- Check build size after changes
- Verify type definitions are correct
- Update documentation

---

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

**Triggers:**
- Push to: `main`, `master`, `develop`
- Pull requests to: `main`, `master`, `develop`

**Jobs:**

#### 1. Test Job (Matrix)
- **Platforms:** Ubuntu latest
- **Node versions:** 18.x, 20.x, 22.x
- **Steps:**
  1. Checkout code
  2. Setup Node.js with npm cache
  3. Install dependencies (`npm ci`)
  4. Run tests (`npm test`)
  5. Run build (`npm run build`)
  6. **Check build size** (FAILS if > 1024 bytes)

#### 2. Lint Job
- **Platform:** Ubuntu latest
- **Node version:** 20.x
- **Steps:**
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies (`npm ci`)
  4. Type check (`npx tsc --noEmit`)

**ALL jobs must pass for PR merge**

---

## Common Development Tasks

### Adding a New Pattern Type

1. **Modify `checkMatch()` in `src/match.js`**
   - Add new condition/logic
   - Maintain order: wildcard → function → primitive → array → object

2. **Add TypeScript types** in `src/match.d.ts` and `match.d.ts`

3. **Write tests** in `test/match.test.js`
   - Basic functionality test
   - Edge case tests

4. **Update documentation** in `README.md`
   - Add example
   - Update API reference

5. **Check build size**: `npm run build && wc -c < dist/match.min.js`

6. **Verify CI passes**: `npm test && npx tsc --noEmit`

### Optimizing Performance

1. **Run benchmarks**: `npm run bench`
2. **Profile bottlenecks** in `src/match.js`
3. **Optimize hot paths** (checkMatch recursion)
4. **Re-run benchmarks** to verify improvement
5. **Ensure no size increase**: `npm run build && wc -c < dist/match.min.js`

### Adding Examples

1. **Create new file** in `examples/` (if needed)
2. **Write clear, real-world examples**
3. **Test example works**: `node examples/file.js` or `npx tsx examples/file.ts`
4. **Reference in `README.md`** if appropriate

### Debugging Tests

```bash
# Run specific test
npx vitest run -t "test name"

# Watch mode for development
npm run test:watch

# Coverage to find untested code
npm run test:coverage
```

---

## Architecture Deep Dive

### The Matcher Closure (`src/match.js:5-58`)

```javascript
export const match = (value) => {
  let matched = false;        // State: has any pattern matched?
  let result = undefined;     // State: result from matched handler

  const matcher = (pattern, handler) => {
    if (matched) {
      // Lazy evaluation: already matched, skip
      if (pattern === _) return result;  // But if wildcard, return result
      return matcher;  // Chain for syntax consistency
    }

    const bindings = {};
    const matches = checkMatch(value, pattern, bindings);

    if (matches) {
      matched = true;
      result = typeof handler === "function"
        ? handler(bindings, value)
        : handler;
      if (pattern === _) return result;  // Wildcard returns immediately
    }

    return matcher;  // Enable chaining
  };

  // Type coercion methods for result extraction
  matcher.valueOf = () => result;
  matcher.toString = () => String(result);
  matcher[Symbol.toPrimitive] = (hint) => {
    if (hint === "number") return Number(result);
    if (hint === "string") return String(result);
    return result;
  };

  return matcher;
};
```

**Key Insights:**
- `matched` flag prevents re-evaluation (lazy)
- `result` stores handler return value
- Wildcard `_` immediately returns result (no chaining)
- Matcher returned for chaining syntax

### The Recursive Pattern Matcher (`src/match.js:62-106`)

```javascript
function checkMatch(value, pattern, bindings) {
  // 1. Wildcard always matches
  if (pattern === _) return true;

  // 2. Function as guard/predicate
  if (typeof pattern === "function") return pattern(value);

  // 3. Primitive values (null, undefined, number, string, boolean, symbol)
  if (typeof pattern !== "object" || pattern === null)
    return Object.is(value, pattern);

  // 4. Arrays (tuple matching)
  if (Array.isArray(pattern)) {
    if (!Array.isArray(value)) return false;
    if (pattern.length !== value.length) return false;
    return pattern.every((p, i) => checkMatch(value[i], p, bindings));
  }

  // 5. Objects (property subset matching)
  if (typeof value !== "object" || value === null) return false;

  for (const key in pattern) {
    const pat = pattern[key];

    // 5a. Capture with $variable
    if (typeof pat === "string" && pat.startsWith("$")) {
      bindings[pat.slice(1)] = value[key];
      continue;  // Always matches
    }

    // 5b. Wildcard in property
    if (pat === _) continue;  // Always matches

    // 5c. Recursive match
    if (!checkMatch(value[key], pat, bindings)) return false;
  }

  return true;
}
```

**Key Insights:**
- Order matters: wildcard → function → primitive → array → object
- `Object.is()` for primitive comparison (handles NaN, -0 correctly)
- Array matching requires exact length match
- Object matching is subset-based (extra properties OK)
- Captures mutate `bindings` object passed by reference

---

## Performance Characteristics

### Benchmark Results (from `npm run bench`)

Comparison against native JavaScript constructs:

| Scenario | match() ops/sec | Native ops/sec | Ratio |
|----------|----------------|----------------|-------|
| Simple Value | 12.26M | 137.56M (switch) | 11.22x slower |
| Object Destructuring | 7.62M | 197.51M (if-else) | 25.91x slower |
| Guards/Predicates | 9.58M | 208.17M (if-else) | 21.74x slower |
| Array Matching | 5.42M | 161.98M (manual) | 29.88x slower |
| Complex Nested | 3.62M | 146.41M (if-else) | 40.39x slower |

**Trade-off Analysis:**
- 10-40x slower than native constructs
- BUT: dramatically more expressive and maintainable
- Performance acceptable for most use cases (millions of ops/sec)
- NOT suitable for ultra-hot paths in tight loops

**When to Use:**
- Redux reducers (clarity > performance)
- Configuration parsing
- Route handlers
- State machines
- Form validation

**When NOT to Use:**
- Inner loops with millions of iterations
- Real-time rendering (game loops)
- Performance-critical hot paths

---

## Error Handling Philosophy

**The library does NOT throw errors intentionally**

- Invalid patterns: return `undefined` (no match)
- Type mismatches: fail to match, continue to next pattern
- Missing properties: treated as `undefined`, may or may not match

**Example:**
```javascript
match({ name: "Ana" })(
  { name: "Ana", age: 18 },  // Partial match: name matches, age is undefined
  "match"
)(_, "no match");
// Returns: "no match" (age property missing in value)
```

**Philosophy:** Fail gracefully, always return a value (even if `undefined`)

---

## Version Compatibility

### Node.js Versions
- **Tested:** 18.x, 20.x, 22.x (CI matrix)
- **Minimum:** 14.x (ES2015 support required)
- **Recommended:** 20.x+ (LTS)

### Browser Support
- **ES2015+ required** (no transpilation included)
- Modern browsers: Chrome 51+, Firefox 54+, Safari 10+, Edge 15+
- **Not compatible:** IE11 (no Symbol support)

### Module Formats
- **ESM:** `src/match.js` (recommended)
- **Minified:** `dist/match.min.js` (production)
- **TypeScript:** `src/match.d.ts` (type definitions)

---

## Git Workflow

### Branch Strategy
- **main/master:** Stable releases
- **develop:** Integration branch
- **Feature branches:** Prefix with `claude/` for AI-generated changes

### Commit Message Format
- Use clear, descriptive commit messages
- Examples:
  - `Add support for regex patterns in matching`
  - `Fix edge case with null values in nested objects`
  - `Update TypeScript definitions for better inference`
  - `Optimize checkMatch performance for large arrays`

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes with tests
3. Verify CI passes (`npm test`, `npm run build`, `npx tsc --noEmit`)
4. Update documentation
5. Create PR to `develop` (not `main`)
6. Wait for CI green checkmark
7. Review and merge

---

## Quick Reference Commands

```bash
# Setup
npm install

# Development
npm run test:watch         # Test-driven development
npm test                   # Run all tests once
npm run build              # Build minified version
npm run bench              # Run benchmarks

# Type Checking
npx tsc --noEmit           # Check TypeScript types

# Verification (before commit)
npm test                   # Tests must pass
npm run build              # Build must succeed
wc -c < dist/match.min.js  # Must be < 1024 bytes
npx tsc --noEmit           # Types must be valid

# CI/CD (automatic)
# Triggers on push to main/master/develop
# Runs: tests (Node 18, 20, 22) + build + size check + type check
```

---

## Troubleshooting

### Build Size Exceeds 1 KB

**Problem:** `dist/match.min.js` > 1024 bytes after `npm run build`

**Solutions:**
1. Remove unnecessary code/comments
2. Simplify logic (reduce branching)
3. Use shorter variable names in minified version
4. Avoid adding new features - optimize existing code
5. Check terser compression settings in `package.json`

### Tests Failing

**Problem:** `npm test` shows failures

**Debug Steps:**
1. Run specific test: `npx vitest run -t "test name"`
2. Check if edge cases are covered
3. Verify lazy evaluation still works
4. Test type coercion methods
5. Review changes to `checkMatch()` logic

### TypeScript Errors

**Problem:** `npx tsc --noEmit` shows type errors

**Solutions:**
1. Update `src/match.d.ts`
2. Update `match.d.ts` (keep in sync)
3. Check generic types are correct
4. Verify handler signatures
5. Test with `examples/typescript-example.ts`

### CI/CD Pipeline Failures

**Problem:** GitHub Actions show red X

**Check:**
1. Test job: Run `npm test` locally
2. Build job: Run `npm run build` locally
3. Size check: Run `wc -c < dist/match.min.js`
4. Lint job: Run `npx tsc --noEmit`

---

## Contact and Resources

- **Repository:** https://github.com/juancristobalgd1/match
- **Issues:** https://github.com/juancristobalgd1/match/issues
- **License:** MIT © 2025 Juan Cristobal
- **Author:** Juan Cristobal

---

## Summary for AI Assistants

**When working on this codebase:**

✅ **DO:**
- Maintain < 1 KB minified size (critical constraint)
- Keep zero production dependencies
- Add tests for all changes (aim for 100% pass rate)
- Update both TypeScript definition files
- Follow existing code style (functional, closures, recursion)
- Check CI passes before committing
- Maintain backward compatibility
- Update documentation

❌ **DON'T:**
- Add production dependencies
- Break the clean chaining syntax
- Remove TypeScript support
- Change public API without discussion
- Skip testing edge cases
- Ignore build size constraint
- Use bleeding-edge JavaScript features

**Critical Files:**
- `src/match.js` - Core implementation (107 lines)
- `test/match.test.js` - Test suite (33 tests)
- `package.json` - Scripts and configuration
- `.github/workflows/ci.yml` - CI/CD pipeline

**Key Commands:**
- `npm test` - Run tests
- `npm run build` - Build and check size
- `npx tsc --noEmit` - Type check

**Remember:** This is a minimalist library. Less is more. Every byte counts. 🎯
