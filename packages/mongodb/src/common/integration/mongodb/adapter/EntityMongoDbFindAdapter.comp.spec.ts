import { Converter } from '@cuaklabs/duck-poker-backend-common';
import { TestEnvDotEnvLoader } from '@cuaklabs/duck-poker-backend-test-utils';
import * as mongodb from 'mongodb';

import { BaseEntityMongoDb } from '../model/BaseEntityMongoDb';
import { EntityMongoDbFindAdapter } from './EntityMongoDbFindAdapter';

interface ModelTest {
  foo: string;
}

interface SearchQueryTest {
  id: string;
}

interface ModelTestDb extends BaseEntityMongoDb {
  foo: string;
}

class EntityMongoDbFindAdapterMock extends EntityMongoDbFindAdapter<
  ModelTest,
  ModelTestDb,
  ModelTestDb,
  SearchQueryTest
> {}

describe('EntityMongoDbFindAdapter', () => {
  let modelTestDbCreationQueryFixture: mongodb.OptionalId<ModelTestDb>;

  let mongodbClient: mongodb.MongoClient;
  let modelTestCollection: mongodb.Collection<ModelTestDb>;
  let modelDbToModelTransformer: jest.Mocked<Converter<ModelTestDb, ModelTest>>;
  let queryToFilterTransformer: jest.Mocked<Converter<SearchQueryTest, mongodb.Filter<ModelTestDb>>>;

  let entityMongoDbFindAdapter: EntityMongoDbFindAdapterMock;

  beforeAll(async () => {
    modelTestDbCreationQueryFixture = {
      foo: 'foo',
    };

    const testEnvDotEnvLoader: TestEnvDotEnvLoader = new TestEnvDotEnvLoader();

    const collectionName: string = 'EntityMongoDbFindAdapterIntegrationTests';
    const dbName: string = 'dbTest';

    mongodbClient = new mongodb.MongoClient(testEnvDotEnvLoader.index.MONGODB_URL);

    await mongodbClient.connect();

    modelDbToModelTransformer = {
      convert: jest.fn(),
    };

    queryToFilterTransformer = {
      convert: jest.fn(),
    };

    modelTestCollection = mongodbClient.db(dbName).collection(collectionName);

    entityMongoDbFindAdapter = new EntityMongoDbFindAdapterMock(
      modelTestCollection,
      modelDbToModelTransformer,
      queryToFilterTransformer,
    );
  });

  afterAll(async () => {
    await mongodbClient.close();
  });

  describe('.find()', () => {
    let modelTestDbCreated: ModelTestDb;

    let modelTestFixture: ModelTest;

    let searchQueryTestFixture: SearchQueryTest;
    let modelTestDbFilterFixture: mongodb.Filter<ModelTestDb>;

    beforeAll(async () => {
      const insertionResult: mongodb.InsertOneResult<mongodb.WithId<ModelTestDb>> = await modelTestCollection.insertOne(
        {
          ...(modelTestDbCreationQueryFixture as mongodb.OptionalUnlessRequiredId<ModelTestDb>),
        },
      );

      modelTestDbCreated = {
        ...modelTestDbCreationQueryFixture,
        _id: insertionResult.insertedId,
      };

      modelTestFixture = {
        foo: modelTestDbCreated.foo,
      };

      searchQueryTestFixture = {
        id: modelTestDbCreated._id.toHexString(),
      };

      modelTestDbFilterFixture = {
        _id: modelTestDbCreated._id,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        modelDbToModelTransformer.convert.mockReturnValueOnce(modelTestFixture);
        queryToFilterTransformer.convert.mockReturnValueOnce(modelTestDbFilterFixture);

        result = await entityMongoDbFindAdapter.find(searchQueryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call modelDbToModelTransformer.convert()', () => {
        expect(modelDbToModelTransformer.convert).toHaveBeenCalledTimes(1);
        expect(modelDbToModelTransformer.convert).toHaveBeenCalledWith(modelTestDbCreated);
      });

      it('should return the found entities', () => {
        expect(result).toStrictEqual([modelTestFixture]);
      });
    });
  });

  describe('.findOne()', () => {
    let modelTestDbCreated: ModelTestDb;

    let modelTestFixture: ModelTest;

    let searchQueryTest: SearchQueryTest;
    let modelTestDbFilter: mongodb.Filter<ModelTestDb>;

    beforeAll(async () => {
      const insertionResult: mongodb.InsertOneResult<mongodb.WithId<ModelTestDb>> = await modelTestCollection.insertOne(
        {
          ...(modelTestDbCreationQueryFixture as mongodb.OptionalUnlessRequiredId<ModelTestDb>),
        },
      );

      modelTestDbCreated = {
        ...modelTestDbCreationQueryFixture,
        _id: insertionResult.insertedId,
      };

      modelTestFixture = {
        foo: modelTestDbCreated.foo,
      };

      searchQueryTest = {
        id: modelTestDbCreated._id.toHexString(),
      };

      modelTestDbFilter = {
        _id: modelTestDbCreated._id,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        modelDbToModelTransformer.convert.mockReturnValueOnce(modelTestFixture);
        queryToFilterTransformer.convert.mockReturnValueOnce(modelTestDbFilter);

        result = await entityMongoDbFindAdapter.findOne(searchQueryTest);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call modelDbToModelTransformer.convert()', () => {
        expect(modelDbToModelTransformer.convert).toHaveBeenCalledTimes(1);
        expect(modelDbToModelTransformer.convert).toHaveBeenCalledWith(modelTestDbCreated);
      });

      it('should return the found entity', () => {
        expect(result).toStrictEqual(modelTestFixture);
      });
    });
  });
});
