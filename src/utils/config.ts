import { config } from 'dotenv';
import { Logger } from './logger';
import { DiscordError } from './error';

config();

export class Config {
  public static get<T>(key: string): T {
    const value = process.env[key];
    if (!value) {
      throw new DiscordError(`Key ${key} not found`, 'Config');
    }

    return value as unknown as T;
  }
}

