export declare const _: unique symbol;

export type Wildcard = typeof _;

// OR pattern helper
export declare function or<T>(...patterns: T[]): (value: T) => boolean;

// Error helper — throws when the pattern matches
export declare function throwError(message: string): () => never;

// Types for bindings captured with $variable
export type Bindings = Record<string, any>;

// Handler can be a direct value or a function that receives bindings
export type Handler<T, R> = R | ((bindings: Bindings, value: T) => R);

// A case is a tuple of [pattern, handler]
export type Case<T, R> = [pattern: any, handler: Handler<T, R>];

export interface ExecuteMatch<T> {
  <R = any>(...cases: Case<T, R>[]): R | undefined;
  exhaustive(): ExecuteMatch<T>;
}

export declare function match<T>(value: T): ExecuteMatch<T>;
export declare function match<T, R = any>(value: T, ...flatCases: any[]): R | undefined;

export as namespace matchPro;
