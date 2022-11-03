export const PIPE_SYMBOL = Symbol();

export function pipe<Fn extends (data: any) => string>(fn: Fn) {
  return <T extends Parameters<Fn>[0]>(data: T) => {
    if (data[PIPE_SYMBOL]) {
      !data[PIPE_SYMBOL].includes(fn) && data[PIPE_SYMBOL].push(fn);
    } else {
      Object.defineProperty(data, PIPE_SYMBOL, {
        value: [fn],
        configurable: false,
      });
    }

    return data;
  };
}
