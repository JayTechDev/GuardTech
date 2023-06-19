const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, roleMention } = require('discord.js');
const { Colours } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('List all server roles.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild } = interaction;

        const ServerRoles = (await guild.roles.fetch()).sort((a, b) => b.position - a.position).map((r) => r);

        const Roles = [];
        ServerRoles.forEach(role => { Roles.push(`${roleMention(role.id)}`) });

        const RolesEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setDescription(Roles.join('\n'))

        interaction.reply({
            embeds: [RolesEmbed]
        });
    },
};
