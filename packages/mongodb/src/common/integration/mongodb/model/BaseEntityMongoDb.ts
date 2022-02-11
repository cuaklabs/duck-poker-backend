import * as mongodb from 'mongodb';

export interface BaseEntityMongoDb<TId = mongodb.ObjectId> {
  _id: TId;
}
