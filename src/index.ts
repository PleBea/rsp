import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Logger } from './utils/logger';
import { Config } from './utils/config';
import { Command } from './utils/command';

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>;
  }
}

// 디스코드 봇 실행 코드
async function bootstrap() {
  // 콘솔에 찍히는 로그 용 코드
  const logger = new Logger('BOOTSTRAP');

  // 디스코드 봇 토큰 불러오기 (.env 파일에 저장된 토큰을 불러옴)
  const TOKEN = Config.get<string>('TOKEN');

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.commands = new Collection();

  const commands = new Command(client);
  commands.initialize();

  client.on('ready', () => {
    logger.success(`Logged in as ${client.user?.tag}`);
  });

  client.login(TOKEN);
}

bootstrap();

