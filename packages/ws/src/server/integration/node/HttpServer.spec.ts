jest.mock('http');

import http from 'http';

import { HttpServer } from './HttpServer';

describe(HttpServer.name, () => {
  let portFixture: number;
  let httpServerMock: jest.Mocked<http.Server>;
  let httpServer: HttpServer;

  beforeAll(() => {
    portFixture = 3001;

    httpServerMock = {
      close: jest.fn(),
      listen: jest.fn(),
      on: jest.fn(),
    } as Partial<jest.Mocked<http.Server>> as jest.Mocked<http.Server>;

    (http.createServer as jest.Mock<http.Server>).mockReturnValueOnce(httpServerMock);

    httpServer = new HttpServer(portFixture);
  });

  describe('.bootstrap()', () => {
    describe('when called', () => {
      beforeAll(async () => {
        httpServerMock.listen.mockImplementationOnce((_port: number, listeningListener?: () => void): http.Server => {
          listeningListener?.();

          return httpServerMock;
        });

        await httpServer.bootstrap();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpServer.listen()', () => {
        expect(httpServerMock.listen).toHaveBeenCalledTimes(1);
        expect(httpServerMock.listen).toHaveBeenCalledWith(portFixture, expect.any(Function));
      });
    });
  });

  describe('.close()', () => {
    describe('when called, and no error occurs', () => {
      beforeAll(async () => {
        httpServerMock.close.mockImplementationOnce(
          (callback?: ((err?: Error | undefined) => void) | undefined): jest.Mocked<http.Server> => {
            callback?.();

            return httpServerMock;
          },
        );

        await httpServer.close();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpServer.close()', () => {
        expect(httpServerMock.close).toHaveBeenCalledTimes(1);
        expect(httpServerMock.close).toHaveBeenCalledWith(expect.any(Function));
      });
    });

    describe('when called, and an error occurs', () => {
      let errorFixture: Error;
      let result: unknown;

      beforeAll(async () => {
        try {
          errorFixture = new Error('Error after httpServerMock.close is called');

          httpServerMock.close.mockImplementationOnce(
            (callback?: ((err?: Error | undefined) => void) | undefined): jest.Mocked<http.Server> => {
              callback?.(errorFixture);

              return httpServerMock;
            },
          );

          await httpServer.close();
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call httpServer.close()', () => {
        expect(httpServerMock.close).toHaveBeenCalledTimes(1);
        expect(httpServerMock.close).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should throw an Error()', () => {
        expect(result).toBe(errorFixture);
      });
    });
  });
});
