import { Converter, EntityFindAdapter } from '@cuaklabs/duck-poker-backend-common';
import * as mongodb from 'mongodb';

export abstract class EntityMongoDbFindAdapter<TModel, TModelDb, TOutputModelDb, TQuery>
  implements EntityFindAdapter<TModel, TQuery>
{
  readonly #collection: mongodb.Collection<TModelDb>;

  constructor(
    collection: mongodb.Collection<TModelDb>,
    protected readonly modelDbToModelTransformer: Converter<TOutputModelDb, TModel>,
    protected readonly queryToFilterTransformer: Converter<TQuery, mongodb.Filter<TModelDb>>,
  ) {
    this.#collection = collection;
  }

  public async find(query: TQuery): Promise<TModel[]> {
    const modelDbFilter: mongodb.Filter<TModelDb> = this.queryToFilterTransformer.convert(query);

    const entitiesDbFound: TOutputModelDb[] = await this.buildFindCursor(query, modelDbFilter).toArray();

    const entitiesFound: TModel[] = entitiesDbFound.map((entityDb: TOutputModelDb) =>
      this.modelDbToModelTransformer.convert(entityDb),
    );

    return entitiesFound;
  }

  public async findOne(query: TQuery): Promise<TModel | null> {
    const modelDbFilter: mongodb.Filter<TModelDb> = this.queryToFilterTransformer.convert(query);

    const entityDbFound: TOutputModelDb | null = await this.#collection.findOne<TOutputModelDb>(
      modelDbFilter,
      this.getFindOptions(),
    );

    const entityFound: TModel | null =
      entityDbFound === null ? null : this.modelDbToModelTransformer.convert(entityDbFound);

    return entityFound;
  }

  protected buildFindCursor(
    _query: TQuery,
    modelDbFilter: mongodb.Filter<TModelDb>,
  ): mongodb.FindCursor<TOutputModelDb> {
    return this.#collection.find<TOutputModelDb>(modelDbFilter, this.getFindOptions());
  }

  protected getFindOptions(): mongodb.FindOptions<TModelDb> {
    return {};
  }
}
