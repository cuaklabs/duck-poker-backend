import http from 'http';
import net from 'net';
import stream from 'stream';

import { Server } from '@cuaklabs/duck-poker-backend-server';

export class HttpServer implements Server {
  readonly #httpServer: http.Server;
  readonly #port: number;
  readonly #socketSet: Set<net.Socket>;

  constructor(port: number) {
    this.#httpServer = http.createServer();
    this.#port = port;
    this.#socketSet = new Set();

    this.#httpServer.on('connection', (socket: net.Socket): void => {
      this.#socketSet.add(socket);

      socket.once('close', () => {
        this.#socketSet.delete(socket);
      });
    });
  }

  public async bootstrap(): Promise<void> {
    await new Promise<void>((resolve: () => void) => {
      this.#httpServer.listen(this.#port, () => {
        resolve();
      });
    });
  }

  public async close(): Promise<void> {
    for (const socket of this.#socketSet) {
      socket.destroy();
    }

    this.#socketSet.clear();

    await new Promise<void>((resolve: () => void, reject: (error: unknown) => void) => {
      this.#httpServer.close((err?: Error | undefined) => {
        if (err === undefined) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  public onUpgrade(listener: (req: http.IncomingMessage, socket: stream.Duplex, head: Buffer) => void): void {
    this.#httpServer.on('upgrade', listener);
  }
}
