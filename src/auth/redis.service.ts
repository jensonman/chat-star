import {RedisClientType, createClient} from 'redis'
import { promisify } from 'util';

export class RedisService {
   readonly client: RedisClientType

  constructor(){
    this.client = createClient({
        url: 'redis://192.168.1.112:6379'
    });

    this.client.on('ready', () => {
        // Redis 客户端已准备就绪
        console.log('isReady:', this.client.isReady); // 输出 true
    });
      
    this.client.on('error', (error) => {
        // 连接出错
        console.error('Redis connection error:', error);
    });
    this.client.connect()
  }

  async get(key: string): Promise<string | null>{
    return await this.client.get(key)
  }

  async set(key: string, value: string): Promise<void>{
    await this.client.set(key, value)
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }
}