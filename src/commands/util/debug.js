const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, PermissionFlagsBits, version, codeBlock } = require('discord.js');
const { Colours } = require('../../config.json');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Returns with bot stats.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const ping = Math.round(client.ws.ping) + 'ms';
        const uptime = ms(client.uptime);

        const DebugEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setDescription('Thanks to [Pixelnest](https://pixelnest.gg) for the hosting!')
        .setImage('https://cdn.discordapp.com/attachments/1097088599406682182/1102294999640592435/2IWWz9gFaYsSPgpG88M5HCGLLTs_Textured_6K.png')
        .setFields(
            {
                name: '• Ping',
                value: codeBlock(ping),
                inline: true
            },
            {
                name: '• Uptime',
                value: codeBlock(uptime),
                inline: true
            },
            {
                name: '• Platform',
                value: codeBlock(process.platform),
                inline: true
            },
            {
                name: '• Node Version',
                value: codeBlock(process.version),
                inline: true
            },
            {
                name: '• Discord.js Version',
                value: codeBlock(version),
                inline: true
            },
            {
                name: '• Total Commands',
                value: codeBlock(client.commands.size),
                inline: true
            }
        )

        interaction.reply({ embeds: [DebugEmbed] });
    },
};
