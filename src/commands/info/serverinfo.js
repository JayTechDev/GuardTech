const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Colours } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Gets information on the server.')
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId } = interaction;

        const ServerBanner = guild.bannerURL({ size: 2048 }) || null;
        const ServerFeatures = guild.features.join('\n> - ') || 'None';

        const InfoEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL()}` })
        .setThumbnail(`${guild.iconURL()}`)
        .setImage(ServerBanner)
        .setDescription([
            `**${guild.name}**`,
            `> **Description:** ${guild.description}`,
            `> **ID:** ${guildId}`,
            `> **Creation:** <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
            `**Statistics**`,
            `> **Members:** ${guild.memberCount}`,
            `> **Boost Level:** ${guild.premiumTier}`,
            `> **Moderation Level:** ${guild.verificationLevel}`,
            `**Counts**`,
            `> **Roles:** ${guild.roles.cache.size}`,
            `> **Channels:** ${guild.channels.cache.size}`,
            `> **Emojis:** ${guild.emojis.cache.size}`,
            `**Features**`,
            `> - ${ServerFeatures}`,
        ].join('\n'))

        interaction.reply({ content: 'https://discord.gg/47fWbK5QYB', embeds: [InfoEmbed] });
    },
};