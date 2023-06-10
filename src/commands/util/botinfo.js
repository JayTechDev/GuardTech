const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, PermissionFlagsBits, version, codeBlock } = require('discord.js');
const { Colours, Links } = require('../../config.json');
const mongoose = require('mongoose');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Returns with bot information.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { user } = interaction;

        // Client
        const ClientPing = Math.round(client.ws.ping) + 'ms';
        const ClientUptime = ms(client.uptime, { long: true });
        const ClientUserCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const ClientApplication = await client.application.fetch();

        // Internal
        const MemoryUsage = Math.floor(process.memoryUsage.rss() / 1024 / 1024) + ' MB';

        const InfoEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setThumbnail(client.user.avatarURL())
        .setFields(
            {
                name: 'Ping',
                value: codeBlock(ClientPing),
                inline: true
            },
            {
                name: 'Users',
                value: codeBlock(ClientUserCount),
                inline: true
            },
            {
                name: 'Memory Usage',
                value: codeBlock(MemoryUsage),
                inline: true
            },
            {
                name: 'Discord.js Version',
                value: codeBlock(version),
                inline: true
            },
            {
                name: 'Node.js Version',
                value: codeBlock(process.version),
                inline: true
            },
            {
                name: 'Commands',
                value: codeBlock(client.commands.size + '/100'),
                inline: true
            },
        )
        .setFooter({ text: `Uptime: ${ClientUptime}` })

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Source').setStyle(ButtonStyle.Link).setURL(Links.Bot_Source),
            new ButtonBuilder().setCustomId('bot-stats').setLabel('Bot Stats').setStyle(ButtonStyle.Primary)
        )

        interaction.reply({ 
            embeds: [InfoEmbed], 
            components: [Buttons],
        }).then((sentMessage) => {
            sentMessage.createMessageComponentCollector({ componentType: ComponentType.Button }).on('collect', async (button) => {
                if (!button.customId == 'bot-stats') return;
                if (!button.member.permissions.has('ManageGuild')) return button.reply({
                    content: 'You cannot use this.',
                    ephemeral: true
                });

                const BotStatsEmbed = new EmbedBuilder()
                .setColor(Colours.Default_Colour)
                .setAuthor({ name: `${client.user.username}'s Stats`, iconURL: `${client.user.displayAvatarURL()}` })
                .setThumbnail(`${client.user.displayAvatarURL()}`)
                .setDescription([
                    `**Status**`,
                    `> **Discord Status:** ${client.isReady() ? 'Connected' : 'Disconnected'}`,
                    `> **Database Status:** ${mongoose.connection.readyState ? 'Connected' : 'Disconnected' || 'Connecting' }`,
                    `> **Process ID:** ${process.pid}`,
                    `> **Node Version:** ${process.version}`,
                    `> **Platform:** ${process.platform ? 'Linux' : 'Windows' || 'Something Else'}`,
                    `**Bot**`,
                    `> **Users:** ${ClientUserCount}`,
                    `> **Ping:** ${ClientPing}`,
                    `> **Memory Usage:** ${MemoryUsage}`,
                    `> **Uptime:** ${ClientUptime}`,
                    `**Application Details**`,
                    `> **ID:** ${ClientApplication.id}`,
                    `> **Name:** ${ClientApplication.name}`,
                    `> **Description:** ${ClientApplication.description}`,
                    `> **Created:** <t:${parseInt(ClientApplication.createdTimestamp/ 1000)}:R>`,
                    `> **Owner:** ${ClientApplication.owner}`
                ].join('\n'))

                button.update({
                    embeds: [BotStatsEmbed]
                });
            });
        });
    },
};
