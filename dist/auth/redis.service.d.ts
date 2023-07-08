import { RedisClientType } from 'redis';
export declare class RedisService {
    readonly client: RedisClientType;
    constructor();
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    del(key: string): Promise<void>;
}
