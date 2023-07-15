// redis 由于内存不够没法用，只能使用内存缓存
import { Injectable } from '@nestjs/common';

interface CacheItem {
  value: any;
  expiration: number;
}

@Injectable()
export class CacheService {
  private cache: { [key: string]: CacheItem } = {};

  set(key: string, value: any, expiration: number) {
    this.cache[key] = {
      value,
      expiration: Date.now() + expiration * 1000,
    };
  }

  get(key: string) {
    const item = this.cache[key];
    if (item && item.expiration > Date.now()) {
      return item.value;
    }
    return null;
  }

  cleanExpiredData() {
    const now = Date.now();
    for (const key in this.cache) {
      if (this.cache[key].expiration < now) {
        delete this.cache[key];
      }
    }
  }
}
