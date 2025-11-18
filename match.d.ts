export declare const _: unique symbol;

export type Wildcard = typeof _;

// Types for bindings captured with $variable
export type Bindings = Record<string, any>;

// Handler can be a direct value or a function that receives bindings.

export type Handler<T, R> = R | ((bindings: Bindings, value: T) => R);

// ============================================

// match(x)(pattern, handler)(pattern, handler)(_, default)

export interface Matcher<T, R = any> {
  // Allow direct calls: (pattern, handler)

  <U = R>(pattern: any, handler: Handler<T, U>): Matcher<T, U>;

  //Type conversion to obtain the result
  valueOf(): R;

  toString(): string;

  [Symbol.toPrimitive](hint: string): any;
}

// ============================================
// MAIN FUNCTION
// ============================================

export declare function match<T>(value: T): Matcher<T>;
