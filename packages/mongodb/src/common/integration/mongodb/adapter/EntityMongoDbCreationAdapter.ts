import { AppError, AppErrorType, Converter, EntityCreationAdapter } from '@cuaklabs/duck-poker-backend-common';
import * as mongodb from 'mongodb';

import { BaseEntityMongoDb } from '../model/BaseEntityMongoDb';

export abstract class EntityMongoDbCreationAdapter<TModel, TModelDb extends BaseEntityMongoDb, TQuery>
  implements EntityCreationAdapter<TModel, TQuery>
{
  private static readonly MONGODB_DUPLICATED_KEY_ERR_CODE: number = 11000;

  readonly #collection: mongodb.Collection<TModelDb>;

  constructor(
    collection: mongodb.Collection<TModelDb>,
    protected readonly modelDbToModelTransformer: Converter<TModelDb, TModel>,
    protected readonly queryToInputModelDbsTransformer: Converter<TQuery, mongodb.OptionalId<TModelDb>[]>,
  ) {
    this.#collection = collection;
  }

  public async create(query: TQuery): Promise<TModel[]> {
    const entitiesDbToInsert: mongodb.OptionalUnlessRequiredId<TModelDb>[] =
      this.queryToInputModelDbsTransformer.convert(query) as mongodb.OptionalUnlessRequiredId<TModelDb>[];

    let entitiesDbCreated: TModelDb[];

    try {
      const entitiesDbInsertionOperation: mongodb.InsertManyResult<TModelDb> = await this.#collection.insertMany(
        entitiesDbToInsert,
      );

      entitiesDbCreated = entitiesDbToInsert as TModelDb[];

      for (const entityIndex in entitiesDbInsertionOperation.insertedIds) {
        (entitiesDbCreated[entityIndex] as TModelDb)._id = entitiesDbInsertionOperation.insertedIds[
          entityIndex
        ] as mongodb.InferIdType<TModelDb>;
      }
    } catch (catchedError: unknown) {
      this.handleInsertError(catchedError);
    }

    const entitiesCreated: TModel[] = await Promise.all(
      entitiesDbCreated.map(async (entityDb: TModelDb) => this.modelDbToModelTransformer.convert(entityDb)),
    );

    return entitiesCreated;
  }

  private handleInsertError(error: unknown): never {
    let errorToThrow: unknown;

    if (
      error instanceof mongodb.MongoError &&
      error.code === EntityMongoDbCreationAdapter.MONGODB_DUPLICATED_KEY_ERR_CODE
    ) {
      errorToThrow = new AppError(
        'Entities could not be created due to a duplicated key error',
        AppErrorType.EntityExists,
      );
    } else {
      errorToThrow = error;
    }

    throw errorToThrow;
  }
}
