export const DT_SYMBOL = Symbol();

export function discreteTransform<Fn extends (data: any) => string>(fn: Fn) {
  function transform<T extends Parameters<Fn>[0]>(data: T): T;
  function transform<T extends Parameters<Fn>[0]>(
    data: T,
    immediately: boolean
  ): string;

  function transform<T extends Parameters<Fn>[0]>(
    data: T,
    immediately: boolean = false
  ) {
    if (immediately) return fn(data);

    if (data[DT_SYMBOL]) {
      !data[DT_SYMBOL].includes(fn) && data[DT_SYMBOL].push(fn);
    } else {
      Object.defineProperty(data, DT_SYMBOL, {
        value: [fn],
        configurable: false,
      });
    }

    return data;
  }

  return transform;
}
