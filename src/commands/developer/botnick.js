const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('botnick')
    .setDescription('Change or reset the bot\'s nickname.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption(option => option.setName('nickname').setDescription('New nickname.').setMaxLength(32).setMinLength(1)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const Nickname = options.getString('nickname');

        const bot = guild.members.me;
        
        const NickEmbed = new EmbedBuilder()
        if (!Nickname) {
            if (!bot.nickname) {
                interaction.reply({ embeds: [NickEmbed.setColor('Red').setDescription(`${Emojis.Error_Emoji} No nickname to reset.`)] });
            } else {
                bot.setNickname('');
                interaction.reply({ embeds: [NickEmbed.setColor('Green').setDescription(`${Emojis.Success_Emoji} Nickname has been reset.`)] });
            };
        } else {
            bot.setNickname(Nickname);
            interaction.reply({ embeds: [NickEmbed.setColor('Green').setDescription(`${Emojis.Success_Emoji} Nickname has been set to ${inlineCode(Nickname)}`)] });
        };
    },
};