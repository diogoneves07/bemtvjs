export const T_FNS_SYMBOL = Symbol();

export function tFn<Fn extends (data: any) => string>(fn: Fn) {
  function transform<T extends Parameters<Fn>[0]>(data: T): T;
  function transform<T extends Parameters<Fn>[0]>(
    data: T,
    immediately: boolean
  ): string;

  function transform<T extends Parameters<Fn>[0]>(data: T) {
    if (data[T_FNS_SYMBOL]) {
      !data[T_FNS_SYMBOL].includes(fn) && data[T_FNS_SYMBOL].push(fn);
    } else {
      Object.defineProperty(data, T_FNS_SYMBOL, {
        value: [fn],
        configurable: false,
      });
    }

    return data;
  }

  return transform;
}
