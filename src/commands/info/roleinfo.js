const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Gets information on a role.')
    .setDMPermission(false)
    .addRoleOption(option => option
            .setName('role')
            .setDescription('Role to get information about.')
            .setRequired(true)    
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Role = options.getRole('role');

        const InfoEmbed = new EmbedBuilder()
        .setColor(Role.hexColor)
        .setDescription([
            `**${Role.name}**`,
            `> **ID:** ${Role.id}`,
            `> **Colour:** ${Role.hexColor}`,
            `> **Hoisted:** ${Role.hoist ? 'Yes' : 'No'}`,
            `> **Position:** ${Role.position}`,
            `> **Mentionable:** ${Role.mentionable ? 'Yes' : 'No'}`,
            `> **Created:** <t:${parseInt(Role.createdTimestamp / 1000)}:R>`
        ].join('\n'))

        interaction.reply({ 
            embeds: [InfoEmbed] 
        });
    },
};