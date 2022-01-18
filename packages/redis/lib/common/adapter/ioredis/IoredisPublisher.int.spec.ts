import IORedis from 'ioredis';

import { IoredisPublisher } from './IoredisPublisher';

describe(IoredisPublisher.name, () => {
  let ioredisClient: IORedis.Redis;

  let ioredisPublisher: IoredisPublisher;

  beforeAll(() => {
    ioredisClient = new IORedis();

    ioredisPublisher = new IoredisPublisher(ioredisClient);
  });

  describe('.publish', () => {
    let channel: string;
    let messageFixture: Record<string, unknown>;
    let stringifiedMessageFixture: string;

    let ioredisSubscriberClientMessageHandler: jest.Mock<void, [string, string]>;
    let ioredisSubscriberClient: IORedis.Redis;

    beforeAll(async () => {
      channel = 'ioredis-publisher-publish-integration-tests-sample-channel';

      messageFixture = { foo: 'bar' };
      stringifiedMessageFixture = JSON.stringify(messageFixture);

      ioredisSubscriberClientMessageHandler = jest.fn<void, [string, string]>();

      ioredisSubscriberClient = new IORedis();

      ioredisSubscriberClient.on('message', ioredisSubscriberClientMessageHandler);

      await ioredisSubscriberClient.subscribe(channel);
    });

    afterAll(() => {
      ioredisSubscriberClient.disconnect();
    });

    describe('when called', () => {
      beforeAll(async () => {
        return new Promise<void>((resolve: () => void) => {
          ioredisSubscriberClientMessageHandler.mockImplementationOnce(() => {
            resolve();
          });

          void ioredisPublisher.publish(channel, messageFixture);
        });
      });

      it('should call ioredisSubscriberClientMessageHandler with the channel and the stringified channel', () => {
        expect(ioredisSubscriberClientMessageHandler).toHaveBeenCalledTimes(1);
        expect(ioredisSubscriberClientMessageHandler).toHaveBeenCalledWith(channel, stringifiedMessageFixture);
      });

      afterAll(() => {
        ioredisClient.disconnect();
        ioredisSubscriberClientMessageHandler.mockClear();
      });
    });
  });
});
