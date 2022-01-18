import dotenv from 'dotenv';

import { EnvLoader } from '../../domain/EnvLoader';

export abstract class DotEnvLoader<T> implements EnvLoader<T> {
  protected innerIndex: T | undefined;

  constructor(protected readonly path: string) {
    this.innerIndex = undefined;
  }

  public get index(): T {
    if (undefined === this.innerIndex) {
      this.load();
    }

    return this.innerIndex as T;
  }

  public load(): void {
    dotenv.config({
      path: this.path,
    });

    this.innerIndex = this.parseIndex();
  }

  protected abstract parseIndex(): T;
}
