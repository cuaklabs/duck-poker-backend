import { AppErrorType } from './AppErrorType';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly type: AppErrorType = AppErrorType.Unknown,
  ) {
    super(message);
  }
}
