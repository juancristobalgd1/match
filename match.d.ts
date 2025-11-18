export declare const _: unique symbol;
export type Wildcard = typeof _;

// Tipos para los bindings capturados con $variable
export type Bindings = Record<string, any>;

// Handler puede ser un valor directo o una función que recibe bindings
export type Handler<T, R> = R | ((bindings: Bindings, value: T) => R);

// ============================================
// SINTAXIS LIMPIA (Recomendada)
// ============================================
// match(x)(pattern, handler)(pattern, handler)(_, default)

export interface Matcher<T, R = any> {
  // Permite llamadas directas: (pattern, handler)
  <U = R>(pattern: any, handler: Handler<T, U>): Matcher<T, U>;

  // API legacy .when()/.else() para backward compatibility
  when<U = R>(pattern: any, handler: Handler<T, U>): Matcher<T, U>;
  else<U = R>(handler: U | ((value: T) => U)): U;

  // Conversión de tipo para obtener el resultado
  valueOf(): R;
  toString(): string;
  [Symbol.toPrimitive](hint: string): any;
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================
export declare function match<T>(value: T): Matcher<T>;

// ============================================
// NAMESPACE (para uso con <script>)
// ============================================
export as namespace matchPro;
