export declare const _: unique symbol;
export declare const DEFAULT: unique symbol;

export type Wildcard = typeof _;
export type Default = typeof DEFAULT;

// OR pattern helper
export declare function or<T>(...patterns: T[]): (value: T) => boolean;

export { DEFAULT as def };

// Types for bindings captured with $variable
export type Bindings = Record<string, any>;

// Handler can be a direct value or a function that receives bindings
export type Handler<T, R> = R | ((bindings: Bindings, value: T) => R);

// A case is a tuple of [pattern, handler]
export type Case<T, R> = [pattern: any, handler: Handler<T, R>];

// ============================================
// match(x)([pattern, handler], [pattern, handler], ...)
// ============================================

export interface ExecuteMatch<T> {
  // Execute match with varargs of cases
  <R = any>(...cases: Case<T, R>[]): R | undefined;

  // Enable exhaustive mode (throws if no match and no default)
  exhaustive(): ExecuteMatch<T>;
}

// ============================================
// MAIN FUNCTION
// ============================================

export declare function match<T>(value: T): ExecuteMatch<T>;

// ============================================
// NAMESPACE (for use with <script>)
// ============================================

export as namespace matchPro;
