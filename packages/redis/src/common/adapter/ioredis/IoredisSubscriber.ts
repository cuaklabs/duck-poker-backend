import IORedis from 'ioredis';

import { RedisSubscriber } from '../../domain/RedisSubscriber';

export abstract class IoredisSubscriber<TContext = void> implements RedisSubscriber<TContext> {
  private readonly channelToContextMap: Map<string, TContext>;

  constructor(private readonly redisClient: IORedis.Redis) {
    this.channelToContextMap = new Map<string, TContext>();

    this.redisClient.on(
      'message',
      (channel: string, message: string): void =>
        void this.handleMessageFromChannel(channel, message, this.channelToContextMap.get(channel) as TContext),
    );
  }

  public async subscribe(channel: string, context: TContext): Promise<void> {
    this.channelToContextMap.set(channel, context);

    await this.redisClient.subscribe(channel);
  }

  public async unsubscribe(channel: string): Promise<void> {
    await this.redisClient.unsubscribe(channel);
  }

  protected abstract handleMessageFromChannel(channel: string, message: string, context: TContext): Promise<void>;
}
