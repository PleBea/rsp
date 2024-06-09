import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

const rsp = ['가위', '바위', '보'];

export default {
  data: new SlashCommandBuilder()
    .setName('가위바위보')
    .setDescription('가위바위보 게임을 시작합니다.')
    .addNumberOption((option) =>
      option
        .setName('횟수')
        .setDescription('가위바위보 게임을 진행할 횟수를 입력해주세요.')
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction) => {
    const round = interaction.options.get('횟수')?.value;

    // 횟수가 0일 때는 사용자와 상호작용을 통해 가위바위보 게임을 진행합니다.
    if (!round) {
      const scissors = new ButtonBuilder()
        .setCustomId('scissors')
        .setLabel('가위')
        .setStyle(ButtonStyle.Primary);
      const rock = new ButtonBuilder()
        .setCustomId('rock')
        .setLabel('바위')
        .setStyle(ButtonStyle.Primary);
      const paper = new ButtonBuilder()
        .setCustomId('paper')
        .setLabel('보')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        scissors,
        rock,
        paper
      );

      await interaction.reply({
        components: [row],
        ephemeral: true,
      });

      return;
    }

    // 힛수가 0보다 클 때는 봇이 스스로 가위바위보 게임을 진행합니다.
    let win = 0;
    let draw = 0;
    let lose = 0;

    const result = [];

    for (let i = 0; i < (round as number); i++) {
      const bot = Math.floor(Math.random() * 3);
      const user = Math.floor(Math.random() * 3);

      result.push({
        bot: rsp[bot],
        user: rsp[user],
      });

      if (bot === user) {
        draw++;
      } else if ((bot + 1) % 3 === user) {
        win++;
      } else {
        lose++;
      }
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.user.username}님의 가위바위보 결과`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      })
      .setTitle('가위바위보 결과')
      .setDescription(`승리 ${win}회\n패배 ${lose}회\n무승부 ${draw}회`)
      .addFields(
        result.map((r, i) => ({
          name: `결과 ${i + 1} | **${
            r.bot === r.user
              ? '무승부'
              : r.bot === rsp[(rsp.indexOf(r.user) + 1) % 3]
              ? '패배'
              : '승리'
          }**`,
          value: `봇 - ${r.bot}\n유저 - ${r.user}\n`,
          inline: true,
        }))
      )
      .setColor('#00b0f4')
      .setFooter({
        text: '가위바위보',
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  },
};

