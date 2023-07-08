"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const redis_1 = require("redis");
class RedisService {
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: 'redis://192.168.1.112:6379'
        });
        this.client.on('ready', () => {
            console.log('isReady:', this.client.isReady);
        });
        this.client.on('error', (error) => {
            console.error('Redis connection error:', error);
        });
        this.client.connect();
    }
    async get(key) {
        return await this.client.get(key);
    }
    async set(key, value) {
        await this.client.set(key, value);
    }
    async del(key) {
        await this.client.del(key);
    }
}
exports.RedisService = RedisService;
//# sourceMappingURL=redis.service.js.map