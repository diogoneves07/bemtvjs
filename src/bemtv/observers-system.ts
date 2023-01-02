type ObserverSystemFn = () => void;

export class ObserverSystem<F = ObserverSystemFn> {
  observers: Set<F> | null = null;

  add(fn: F) {
    if (!this.observers) this.observers = new Set();
    this.observers?.add(fn);

    return this;
  }

  addWithPriority(fn: F) {
    this.observers = new Set([fn, ...(this.observers || [])]);

    return this;
  }

  delete(fn: F) {
    this.observers?.delete(fn);

    return this;
  }

  clear() {
    this.observers?.clear();

    return this;
  }

  dispatch(...values: any[]) {
    this.observers?.forEach((fn) => (fn as any)(...(values as [])));
    return this;
  }

  size() {
    return this.observers?.size || 0;
  }
}
