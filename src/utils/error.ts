import { Logger } from './logger';

export class DiscordError extends Error {
  constructor(message: string, type: string) {
    super(message);
    this.name = 'DiscordError';
    this.initMessage(type);
  }

  private initMessage(type: string) {
    const logger = new Logger(type);
    logger.error(this.message);
  }
}

