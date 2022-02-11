import { Converter } from '@cuaklabs/duck-poker-backend-common';
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

const FOO_VALUE: string = 'bar';

describe('EntityMongoDbFindAdapter', () => {
  let collectionMock: jest.Mocked<mongodb.Collection<ModelTestDb>>;
  let modelDbToModelConverter: jest.Mocked<Converter<ModelTestDb, ModelTest>>;
  let queryToFilterConverter: jest.Mocked<Converter<SearchQueryTest, mongodb.Filter<ModelTestDb>>>;

  let entityMongoDbFindAdapter: EntityMongoDbFindAdapterMock;

  beforeAll(() => {
    collectionMock = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as Partial<jest.Mocked<mongodb.Collection<ModelTestDb>>> as jest.Mocked<mongodb.Collection<ModelTestDb>>;

    modelDbToModelConverter = {
      convert: jest.fn(),
    };

    queryToFilterConverter = {
      convert: jest.fn(),
    };

    entityMongoDbFindAdapter = new EntityMongoDbFindAdapterMock(
      collectionMock,
      modelDbToModelConverter,
      queryToFilterConverter,
    );
  });

  describe('.find()', () => {
    describe('when called', () => {
      let modelTestDbFixture: ModelTestDb;
      let modelTestFixture: ModelTest;
      let searchQueryTestFixture: SearchQueryTest;
      let modelTestDbFilterFixture: mongodb.Filter<ModelTestDb>;

      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = {
          foo: FOO_VALUE,
        };

        modelTestDbFixture = {
          _id: new mongodb.ObjectId(),
          foo: FOO_VALUE,
        };

        searchQueryTestFixture = {
          id: modelTestDbFixture._id.toHexString(),
        };

        modelTestDbFilterFixture = {
          _id: modelTestDbFixture._id,
        };

        const findCursorMock: mongodb.FindCursor<ModelTestDb> = {
          toArray: jest.fn().mockResolvedValueOnce([modelTestDbFixture]),
        } as Partial<mongodb.FindCursor<ModelTestDb>> as mongodb.FindCursor<ModelTestDb>;

        collectionMock.find.mockReturnValueOnce(findCursorMock);

        modelDbToModelConverter.convert.mockReturnValueOnce(modelTestFixture);

        queryToFilterConverter.convert.mockReturnValueOnce(modelTestDbFilterFixture);

        result = await entityMongoDbFindAdapter.find(searchQueryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryToFilterTransformer.convert()', () => {
        expect(queryToFilterConverter.convert).toHaveBeenCalledTimes(1);
        expect(queryToFilterConverter.convert).toHaveBeenCalledWith(searchQueryTestFixture);
      });

      it('should call collection.find()', () => {
        expect(collectionMock.find).toHaveBeenCalledTimes(1);
        expect(collectionMock.find).toHaveBeenCalledWith(modelTestDbFilterFixture, {});
      });

      it('should call modelDbToModelTransformer.convert()', () => {
        expect(modelDbToModelConverter.convert).toHaveBeenCalledTimes(1);
        expect(modelDbToModelConverter.convert).toHaveBeenCalledWith(modelTestDbFixture);
      });

      it('should return the found entities', () => {
        expect(result).toStrictEqual([modelTestFixture]);
      });
    });
  });

  describe('.findOne()', () => {
    describe('when called', () => {
      let modelTestDbFixture: ModelTestDb;
      let modelTestFixture: ModelTest;
      let searchQueryTestFixture: SearchQueryTest;
      let modelTestDbFilterFixture: mongodb.Filter<ModelTestDb>;

      let result: unknown;

      beforeAll(async () => {
        modelTestFixture = {
          foo: FOO_VALUE,
        };

        modelTestDbFixture = {
          _id: new mongodb.ObjectId(),
          foo: FOO_VALUE,
        };

        searchQueryTestFixture = {
          id: modelTestDbFixture._id.toHexString(),
        };

        modelTestDbFilterFixture = {
          _id: modelTestDbFixture._id,
        };

        (collectionMock.findOne as jest.Mock).mockResolvedValueOnce(modelTestDbFixture);

        modelDbToModelConverter.convert.mockReturnValueOnce(modelTestFixture);

        queryToFilterConverter.convert.mockReturnValueOnce(modelTestDbFilterFixture);

        result = await entityMongoDbFindAdapter.findOne(searchQueryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call queryToFilterTransformer.convert()', () => {
        expect(queryToFilterConverter.convert).toHaveBeenCalledTimes(1);
        expect(queryToFilterConverter.convert).toHaveBeenCalledWith(searchQueryTestFixture);
      });

      it('should call collection.findOne()', () => {
        expect(collectionMock.findOne).toHaveBeenCalledTimes(1);
        expect(collectionMock.findOne).toHaveBeenCalledWith(modelTestDbFilterFixture, {});
      });

      it('should call modelDbToModelTransformer.convert()', () => {
        expect(modelDbToModelConverter.convert).toHaveBeenCalledTimes(1);
        expect(modelDbToModelConverter.convert).toHaveBeenCalledWith(modelTestDbFixture);
      });

      it('should return domain entities found', () => {
        expect(result).toStrictEqual(modelTestFixture);
      });
    });
  });
});
