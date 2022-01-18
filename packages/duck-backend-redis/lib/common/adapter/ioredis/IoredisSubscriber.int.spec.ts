import IORedis from 'ioredis';

import { IoredisSubscriber } from './IoredisSubscriber';

interface ContextFixture {
  foo: string;
}

class IoredisSubscriberMock extends IoredisSubscriber<ContextFixture> {
  constructor(
    redisClient: IORedis.Redis,
    private readonly messageFromChannelHandler: jest.Mock<Promise<void>, [string, string, ContextFixture]>,
  ) {
    super(redisClient);
  }

  protected async handleMessageFromChannel(channel: string, message: string, context: ContextFixture): Promise<void> {
    await this.messageFromChannelHandler(channel, message, context);
  }
}

describe(IoredisSubscriber.name, () => {
  let ioredisClient: IORedis.Redis;
  let ioredisSubscriberClient: IORedis.Redis;
  let messageFromChannelHandler: jest.Mock<Promise<void>, [string, string, ContextFixture]>;

  let ioredisSubscriber: IoredisSubscriberMock;

  beforeAll(() => {
    ioredisClient = new IORedis();
    ioredisSubscriberClient = new IORedis();

    messageFromChannelHandler = jest.fn<Promise<void>, [string, string, ContextFixture]>();

    ioredisSubscriber = new IoredisSubscriberMock(ioredisSubscriberClient, messageFromChannelHandler);
  });

  describe('.subscribe()', () => {
    let channel: string;

    beforeAll(() => {
      channel = 'sample-channel';
    });

    describe('when called', () => {
      let contextFixture: ContextFixture;

      beforeAll(async () => {
        contextFixture = { foo: 'bar' };

        await ioredisSubscriber.subscribe(channel, contextFixture);
      });

      describe('when a message is published to the channel', () => {
        let message: string;

        beforeAll(async () => {
          message = 'sample-message';

          await new Promise<void>((resolve: () => void) => {
            messageFromChannelHandler.mockImplementationOnce(async () => {
              resolve();
            });

            void ioredisClient.publish(channel, message);
          });
        });

        afterAll(() => {
          ioredisClient.disconnect();
          ioredisSubscriberClient.disconnect();
        });

        it('must call messageFromChannelHandler', () => {
          expect(messageFromChannelHandler).toHaveBeenCalledTimes(1);
          expect(messageFromChannelHandler).toHaveBeenCalledWith(channel, message, contextFixture);
        });
      });
    });
  });
});
