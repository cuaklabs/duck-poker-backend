import { EitherEither } from './EitherEither';
import { ValueEither } from './ValueEither';

export type Either<TValue, TEither> = EitherEither<TEither> | ValueEither<TValue>;
