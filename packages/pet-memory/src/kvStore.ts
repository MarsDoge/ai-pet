export class KVStore<T extends Record<string, unknown> = Record<string, unknown>> {
  private data: T;

  constructor(initial: T = {} as T) {
    this.data = { ...initial };
  }

  get(): T {
    return { ...this.data };
  }

  set(patch: Partial<T>): T {
    this.data = {
      ...this.data,
      ...patch
    };
    return this.get();
  }
}
