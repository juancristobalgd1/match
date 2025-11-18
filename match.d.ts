export declare const _: unique symbol;

export type Wildcard = typeof _;

// Range helper for numeric matching
export declare function range(min: number, max: number): (value: any) => boolean;

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

// Tuple for array syntax
export type MatchTuple<T, R = any> = [pattern: any, handler: Handler<T, R>];

// Object syntax for simple cases
export type MatchObject<R = any> = Record<string | number | symbol, Handler<any, R>>;

// Overloads for different syntaxes
export declare function match<T>(value: T): Matcher<T>; // Chained
export declare function match<T, R = any>(value: T, patterns: MatchTuple<T, R>[]): R; // Array
export declare function match<T, R = any>(value: T, patterns: MatchObject<R>): R; // Object
