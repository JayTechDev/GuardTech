const { ChatInputCommandInteraction, SlashCommandBuilder, Client, PermissionFlagsBits, OAuth2Scopes } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Makes a bot invite.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const invite = client.generateInvite({
            scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            permissions: [PermissionFlagsBits.Administrator]
        });

        interaction.reply({
            content: `${invite}`,
            ephemeral: true
        });
    },
};
