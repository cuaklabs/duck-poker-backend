import { Converter } from '@cuaklabs/duck-poker-backend-common';
import * as mongodb from 'mongodb';

import { BaseEntityMongoDb } from '../model/BaseEntityMongoDb';
import { EntityMongoDbCreationAdapter } from './EntityMongoDbCreationAdapter';

interface ModelTest {
  foo: string;
}

interface InsertQueryTest {
  foo: string;
}

interface ModelTestDb extends BaseEntityMongoDb {
  foo: string;
}

class EntityMongoDbCreationAdapterMock extends EntityMongoDbCreationAdapter<ModelTest, ModelTestDb, InsertQueryTest> {}

describe('EntityMongoDbCreationAdapter', () => {
  let collectionMock: mongodb.Collection<ModelTestDb>;
  let modelDbToModelTransformer: jest.Mocked<Converter<ModelTestDb, ModelTest>>;
  let queryToInputModelDbs: jest.Mocked<Converter<InsertQueryTest, mongodb.OptionalId<ModelTestDb>[]>>;

  let entityMongoDbCreationAdapter: EntityMongoDbCreationAdapterMock;

  beforeAll(() => {
    collectionMock = {
      insertMany: jest.fn(),
    } as Partial<mongodb.Collection<ModelTestDb>> as mongodb.Collection<ModelTestDb>;

    modelDbToModelTransformer = {
      convert: jest.fn(),
    };

    queryToInputModelDbs = {
      convert: jest.fn(),
    };

    entityMongoDbCreationAdapter = new EntityMongoDbCreationAdapterMock(
      collectionMock,
      modelDbToModelTransformer,
      queryToInputModelDbs,
    );
  });

  describe('.insert()', () => {
    describe('when called', () => {
      let result: unknown;

      let insertQueryTestFixture: InsertQueryTest;
      let insertResultFixture: mongodb.InsertManyResult<mongodb.WithId<ModelTestDb>>;
      let modelTestDbFixture: ModelTestDb;
      let modelTestFixture: ModelTest;

      beforeAll(async () => {
        modelTestDbFixture = {
          _id: new mongodb.ObjectId(),
          foo: 'bar',
        };

        modelTestFixture = {
          foo: modelTestDbFixture.foo,
        };

        insertQueryTestFixture = {
          foo: modelTestFixture.foo,
        };

        modelDbToModelTransformer.convert.mockReturnValueOnce(modelTestFixture);

        insertResultFixture = {
          acknowledged: true,
          insertedIds: {
            0: modelTestDbFixture._id,
          },
        } as Partial<mongodb.InsertManyResult<ModelTestDb>> as mongodb.InsertManyResult<ModelTestDb>;

        (collectionMock.insertMany as jest.Mock).mockResolvedValueOnce(insertResultFixture);

        queryToInputModelDbs.convert.mockReturnValueOnce([
          {
            foo: modelTestFixture.foo,
          },
        ]);

        result = await entityMongoDbCreationAdapter.create(insertQueryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryToInputModelDbs.convert() with the input received', () => {
        expect(queryToInputModelDbs.convert).toHaveBeenCalledTimes(1);
        expect(queryToInputModelDbs.convert).toHaveBeenCalledWith(insertQueryTestFixture);
      });

      it('should call modelDbToModelTransformer.convert() with the db entity received', () => {
        expect(modelDbToModelTransformer.convert).toHaveBeenCalledTimes(1);
        expect(modelDbToModelTransformer.convert).toHaveBeenCalledWith(modelTestDbFixture);
      });

      it('should return domain entities tranformed from db entities', () => {
        expect(result).toStrictEqual([modelTestFixture]);
      });
    });
  });
});
