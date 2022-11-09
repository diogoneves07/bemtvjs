export const PIPE_SYMBOL = Symbol();

export function pipe<Fn extends (data: any) => string>(fn: Fn) {
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

    if (data[PIPE_SYMBOL]) {
      !data[PIPE_SYMBOL].includes(fn) && data[PIPE_SYMBOL].push(fn);
    } else {
      Object.defineProperty(data, PIPE_SYMBOL, {
        value: [fn],
        configurable: false,
      });
    }

    return data;
  }

  return transform;
}
