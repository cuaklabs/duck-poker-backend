export interface EnvLoader<T> {
  index: T;
  load(): void;
}
