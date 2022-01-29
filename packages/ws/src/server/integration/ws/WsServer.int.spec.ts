import http from 'http';

import { Converter, ValueEither, ValueOrErrors } from '@cuaklabs/duck-poker-backend-common';
import WebSocket from 'ws';

import { WsMessageHandler } from '../../domain/WsMessageHandler';
import { HttpServer } from '../node/HttpServer';
import { WsServer } from './WsServer';

interface RequestContextMock {
  context: unknown;
}

async function waitSocketConnected(socket: WebSocket): Promise<void> {
  return new Promise((resolve: () => void) => {
    const interval: NodeJS.Timeout = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

describe(WsServer.name, () => {
  let httpRequestToConnectionContextConverterMock: jest.Mocked<
    Converter<http.IncomingMessage, ValueOrErrors<RequestContextMock>>
  >;
  let wsMessageHandlerMock: jest.Mocked<WsMessageHandler<unknown, RequestContextMock>>;

  beforeAll(() => {
    httpRequestToConnectionContextConverterMock = {
      convert: jest.fn(),
    };
    wsMessageHandlerMock = {
      handle: jest.fn().mockResolvedValue(undefined),
    };
  });

  describe('.bootstrap()', () => {
    describe('having an incoming message', () => {
      let requestContextOrErrorsFixture: ValueEither<RequestContextMock>;

      beforeAll(() => {
        requestContextOrErrorsFixture = {
          isEither: false,
          value: {
            context: undefined,
          },
        };
      });

      describe('when called', () => {
        let wsServer: WsServer<RequestContextMock>;
        let webSocket: WebSocket;
        let webSocketOnOpenHandlerMock: jest.Mock;
        let webSocketOnUpgradeHandlerMock: jest.Mock;

        let httpServer: HttpServer;

        beforeAll(async () => {
          const port: number = 25611;

          httpServer = new HttpServer(port);

          wsServer = new WsServer(httpRequestToConnectionContextConverterMock, httpServer, wsMessageHandlerMock);

          await wsServer.bootstrap();

          httpRequestToConnectionContextConverterMock.convert.mockReturnValueOnce(requestContextOrErrorsFixture);

          webSocket = new WebSocket(`ws://localhost:${port}`);

          return new Promise<void>((resolve: () => void) => {
            webSocketOnOpenHandlerMock = jest.fn();

            webSocketOnUpgradeHandlerMock = jest.fn().mockImplementationOnce(() => {
              resolve();
            });

            webSocket.on('open', webSocketOnOpenHandlerMock);
            webSocket.on('upgrade', webSocketOnUpgradeHandlerMock);
          });
        });

        afterAll(async () => {
          await wsServer.close();
        });

        it('websocket open event must be raised', () => {
          expect(webSocketOnOpenHandlerMock).toHaveBeenCalledTimes(1);
        });

        it('websocket upgrade event must be raised', () => {
          expect(webSocketOnUpgradeHandlerMock).toHaveBeenCalledTimes(1);
        });

        describe('when the client sends a message', () => {
          let message: string;
          let messageObject: unknown;

          beforeAll(() => {
            message = '{ "text": "sample message" }';
            messageObject = JSON.parse(message);
          });

          describe('when the message is handled successfully', () => {
            beforeAll(async () => {
              await waitSocketConnected(webSocket);

              return new Promise<void>((resolve: () => void) => {
                wsMessageHandlerMock.handle.mockImplementationOnce(async (): Promise<void> => {
                  resolve();
                });

                webSocket.send(message);
              });
            });

            it('should call wsMessageHandler.handle()', () => {
              expect(wsMessageHandlerMock.handle).toHaveBeenCalledTimes(1);
              expect(wsMessageHandlerMock.handle).toHaveBeenCalledWith(
                expect.any(WebSocket),
                messageObject,
                requestContextOrErrorsFixture.value,
              );
            });
          });
        });
      });
    });
  });
});
