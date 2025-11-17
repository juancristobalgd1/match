export declare const _: unique symbol;
export type Wildcard = typeof _;

export function match<T>(value: T): {
  case: any;
};

export as namespace matchPro;
