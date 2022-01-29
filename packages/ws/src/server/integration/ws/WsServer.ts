import http from 'http';
import stream from 'stream';

import { Converter, ValueOrErrors } from '@cuaklabs/duck-poker-backend-common';
import { Server } from '@cuaklabs/duck-poker-backend-server';
import WebSocket from 'ws';

import { WsMessageHandler } from '../../domain/WsMessageHandler';
import { HttpServer } from '../node/HttpServer';

export class WsServer<TConnnectionContext> implements Server {
  readonly #httpRequestToConnectionContextConverter: Converter<
    http.IncomingMessage,
    ValueOrErrors<TConnnectionContext>
  >;
  readonly #httpServer: HttpServer;
  readonly #wsMessageHandler: WsMessageHandler<unknown, TConnnectionContext>;

  constructor(
    httpRequestToConnectionContextConverter: Converter<http.IncomingMessage, ValueOrErrors<TConnnectionContext>>,
    httpServer: HttpServer,
    wsMessageHandler: WsMessageHandler<unknown, TConnnectionContext>,
  ) {
    this.#httpRequestToConnectionContextConverter = httpRequestToConnectionContextConverter;
    this.#httpServer = httpServer;
    this.#wsMessageHandler = wsMessageHandler;

    const webSocketServer: WebSocket.Server = new WebSocket.Server({
      noServer: true,
    });

    webSocketServer.on(
      'connection',
      (socket: WebSocket, _request: http.IncomingMessage, connectionContext: TConnnectionContext): void => {
        void this.#webSocketServerOnConnectionHandler(socket, connectionContext);
      },
    );

    httpServer.onUpgrade((request: http.IncomingMessage, socket: stream.Duplex, head: Buffer) => {
      const connectionContextOrErrors: ValueOrErrors<TConnnectionContext> =
        this.#httpRequestToConnectionContextConverter.convert(request);

      if (connectionContextOrErrors.isEither) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
      } else {
        const connnectionContext: TConnnectionContext = connectionContextOrErrors.value;
        webSocketServer.handleUpgrade(request, socket, head, function done(webSocket: WebSocket) {
          webSocketServer.emit('connection', webSocket, request, connnectionContext);
        });
      }
    });
  }

  public async bootstrap(): Promise<void> {
    await this.#httpServer.bootstrap();
  }

  public async close(): Promise<void> {
    await this.#httpServer.close();
  }

  #handleError(socket: WebSocket, error: unknown): void {
    const stringifiedErrorMessage: string = JSON.stringify(error, Object.getOwnPropertyNames(error));

    const errorObject: Record<string, unknown> = {
      message: `Unable to parse message. Underlying error:\n\n ${stringifiedErrorMessage}`,
    };

    const stringifiedErrorObject: string = JSON.stringify(errorObject);

    socket.send(stringifiedErrorObject);
  }

  async #webSocketServerOnConnectionHandler(socket: WebSocket, connectionContext: TConnnectionContext): Promise<void> {
    socket.on('message', (data: WebSocket.RawData, _isBinary: boolean): void => {
      void this.#webSocketOnMessageHandler(socket, data, connectionContext);
    });
  }

  async #webSocketOnMessageHandler(
    socket: WebSocket,
    data: WebSocket.RawData,
    connectionContext: TConnnectionContext,
  ): Promise<void> {
    try {
      const stringifiedData: string = data.toString();

      const parsedData: unknown = JSON.parse(stringifiedData);

      await this.#wsMessageHandler.handle(socket, parsedData, connectionContext);
    } catch (err: unknown) {
      this.#handleError(socket, err);
    }
  }
}
