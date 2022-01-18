import IORedis from 'ioredis';

import { RedisPublisher } from '../../domain/RedisPublisher';

export class IoredisPublisher implements RedisPublisher {
  readonly #redisClient: IORedis.Redis;

  constructor(redisClient: IORedis.Redis) {
    this.#redisClient = redisClient;
  }

  public async publish(key: string, body: Record<string, unknown>): Promise<void> {
    await this.#redisClient.publish(key, JSON.stringify(body));
  }
}
