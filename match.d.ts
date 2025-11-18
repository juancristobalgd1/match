export declare const _: unique symbol;
export type Wildcard = typeof _;

// Tipos para los bindings capturados con $variable
export type Bindings = Record<string, any>;

// Handler puede ser un valor directo o una función que recibe bindings
export type Handler<T, R> = R | ((bindings: Bindings, value: T) => R);

// Chain API para .when().else()
export interface MatchChain<T, R = any> {
  when<U = R>(pattern: any, handler: Handler<T, U>): MatchChain<T, U>;
  else<U = R>(handler: U | ((value: T) => U)): U;
}

export declare function match<T>(value: T): MatchChain<T>;

export as namespace matchPro;
