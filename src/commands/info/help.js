const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, codeBlock } = require('discord.js');
const { Colours } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows a list of commands.')
        .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild } = interaction;

        const HelpEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setTitle('Help')
        .setDescription(`${client.user.username} is a private moderation and utility bot for ${guild.name}, currently managed and maintaned by the lovely development team!`)
        .setThumbnail(client.user.avatarURL())
        .setFields(
            {
                name: '• Info',
                value: codeBlock('help, membercount, serverinfo, userinfo')
            },
            {
                name: '• Moderation',
                value: codeBlock('ban, block, case, kick, lock, mod, mute, nick, purge, rmpunish, slowmode, softban, unban, unblock, unlock, unmute, warn')
            },
            {
                name: '• Misc',
                value: codeBlock('archive, avatar, dm, icon, impersonate, profile, roles, say')
            },
            {
                name: '• Images',
                value: codeBlock('capybara')
            },
            {
                name: '• Games',
                value: codeBlock('8ball')
            },
            {
                name: '• Util',
                value: codeBlock('blacklist, customrole, debug, key, partner, ping, status')
            },
            {
                name: '• Developer',
                value: codeBlock('botnick, invite')
            }
        )

        interaction.reply({ 
            embeds: [HelpEmbed],
        });
    },
};
