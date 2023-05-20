const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, version, codeBlock } = require('discord.js');
const { Colours, Links } = require('../../config.json');
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
        // Client
        const ClientPing = Math.round(client.ws.ping) + 'ms';
        const ClientUptime = ms(client.uptime, { long: true });
        const ClientUserCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        // Internal
        const MemoryUsage = Math.floor(process.memoryUsage.rss() / 1024 / 1024) + ' MB';

        const InfoEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setThumbnail(client.user.avatarURL())
        .setFields(
            {
                name: '• Ping',
                value: codeBlock(ClientPing),
                inline: true
            },
            {
                name: '• Users',
                value: codeBlock(ClientUserCount),
                inline: true
            },
            {
                name: '• Memory Usage',
                value: codeBlock(MemoryUsage),
                inline: true
            },
            {
                name: '• Discord.js Version',
                value: codeBlock(version),
                inline: true
            },
            {
                name: '• Node.js Version',
                value: codeBlock(process.version),
                inline: true
            },
            {
                name: '• Commands',
                value: codeBlock(client.commands.size + '/100'),
                inline: true
            },
        )
        .setFooter({ text: `Uptime: ${ClientUptime}` })

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Source').setStyle(ButtonStyle.Link).setURL(Links.Bot_Source)
        )

        interaction.reply({ 
            embeds: [InfoEmbed], 
            components: [Buttons]
        });
    },
};
