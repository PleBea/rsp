import chalk from 'chalk';
import { DateTime } from 'luxon';

export class Logger {
  private PREFIX = '';

  constructor(private readonly prefix: string) {
    this.PREFIX = prefix;
  }

  getTime() {
    return DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss');
  }

  log(message: string) {
    console.log(
      chalk.whiteBright(
        `${this.getTime()}` +
          chalk.yellowBright(` [${this.PREFIX}] `) +
          `${message}`
      )
    );
  }

  success(message: string) {
    console.log(
      chalk.greenBright(
        `${this.getTime()}` +
          chalk.yellowBright(` [${this.PREFIX}] `) +
          `${message}`
      )
    );
  }

  error(message: string) {
    console.log(
      chalk.redBright(
        `${this.getTime()}` +
          chalk.yellowBright(` [${this.PREFIX}] `) +
          `${message}`
      )
    );
  }

  warn(message: string) {
    console.log(
      chalk.yellowBright(
        `${this.getTime()}` +
          chalk.yellowBright(` [${this.PREFIX}] `) +
          `${message}`
      )
    );
  }
}

