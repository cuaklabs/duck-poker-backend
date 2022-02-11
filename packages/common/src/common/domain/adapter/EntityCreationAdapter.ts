export interface EntityCreationAdapter<TModel, TQuery> {
  create(query: TQuery): Promise<TModel[]>;
}
