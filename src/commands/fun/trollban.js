const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode, userMention } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('trollban')
    .setDescription('"Ban" a user from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption(option => option.setName('target').setDescription('User to ban.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The ban reason.')),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const TargetUser = options.getUser('target');
        const BanReason = options.getString('reason') || 'No reason provided.';

        const BanSuccessEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been banned | ${inlineCode(BanReason)}`)

        interaction.reply({ embeds: [BanSuccessEmbed] });
    },
};