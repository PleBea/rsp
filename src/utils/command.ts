import { Client, Events, REST, Routes } from 'discord.js';
import { Config } from '../utils/config';
import { Logger } from './logger';

export class Command {
  client: Client;
  rest: REST;
  logger: Logger;

  constructor(client: Client) {
    this.client = client;
    this.rest = new REST({ version: '10' }).setToken(
      Config.get<string>('TOKEN')
    );

    this.logger = new Logger('COMMAND');
  }

  async initializeEvent() {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      const command = interaction.client.commands.get(interaction.commandName);

      try {
        this.logger.log(
          `Command: ${interaction.commandName} | User: ${interaction.user.tag}`
        );
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        }
      }
    });
  }

  async initializeSlashCommand(commands: any[]) {
    await this.rest.put(
      Routes.applicationGuildCommands(
        Config.get<string>('CLIENT_ID'),
        Config.get<string>('GUILD_ID')
      ),
      { body: commands.map((command) => command.data) }
    );

    this.logger.success('Successfully registered slash commands!');
  }

  async loadCommands() {
    const commands = (await import('../commands')).default;
    const commandsData = [];

    for (const [name, command] of Object.entries(commands)) {
      if (!command.data || !command.execute) {
        continue;
      }
      this.client.commands.set(name, command);
      commandsData.push(command);

      this.logger.success(`Loaded command: ${name}`);
    }

    return commandsData;
  }

  async initialize() {
    const commands = await this.loadCommands();

    await this.initializeSlashCommand(commands);
    await this.initializeEvent();

    return commands;
  }
}

