import { Converter } from '@cuaklabs/duck-poker-backend-common';
import { TestEnvDotEnvLoader } from '@cuaklabs/duck-poker-backend-test-utils';
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
  let mongodbClient: mongodb.MongoClient;

  let modelDbToModelConverter: jest.Mocked<Converter<ModelTestDb, ModelTest>>;

  let queryToInputModelDbsConverter: jest.Mocked<Converter<InsertQueryTest, mongodb.OptionalId<ModelTestDb>[]>>;

  let entityMongoDbCreationAdapter: EntityMongoDbCreationAdapterMock;

  beforeAll(async () => {
    const collectionName: string = 'EntityMongoDbCreationAdapterIntegrationTests';
    const dbName: string = 'testDb';
    const testEnvDotEnvLoader: TestEnvDotEnvLoader = new TestEnvDotEnvLoader();

    mongodbClient = new mongodb.MongoClient(testEnvDotEnvLoader.index.MONGODB_URL);

    await mongodbClient.connect();

    modelDbToModelConverter = {
      convert: jest.fn(),
    };

    queryToInputModelDbsConverter = {
      convert: jest.fn(),
    };

    const collection: mongodb.Collection<ModelTestDb> = mongodbClient.db(dbName).collection(collectionName);

    entityMongoDbCreationAdapter = new EntityMongoDbCreationAdapterMock(
      collection,
      modelDbToModelConverter,
      queryToInputModelDbsConverter,
    );
  });

  afterAll(async () => {
    await mongodbClient.close();
  });

  describe('.insert()', () => {
    let result: unknown;

    let insertQueryTestFixture: InsertQueryTest;
    let modelTestFixture: ModelTest;
    let modelTestDbFixture: ModelTestDb;

    beforeAll(async () => {
      modelTestFixture = {
        foo: 'bar',
      };

      modelTestDbFixture = {
        _id: new mongodb.ObjectId(),
        foo: 'bar',
      };

      insertQueryTestFixture = {
        foo: modelTestFixture.foo,
      };

      modelDbToModelConverter.convert.mockReturnValueOnce(modelTestFixture);

      queryToInputModelDbsConverter.convert.mockReturnValueOnce([modelTestDbFixture]);

      result = await entityMongoDbCreationAdapter.create(insertQueryTestFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call modelDbToModelConverter.convert() with the db entity received', () => {
      expect(modelDbToModelConverter.convert).toHaveBeenCalledTimes(1);
      expect(modelDbToModelConverter.convert).toHaveBeenCalledWith(modelTestDbFixture);
    });

    it('should return domain entities coverted from db entities', () => {
      expect(result).toStrictEqual([modelTestFixture]);
    });
  });
});
