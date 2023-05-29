const { ChatInputCommandInteraction, SlashCommandBuilder, inlineCode } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Gets the current number of members.')
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild } = interaction;

        interaction.reply({
            content: `Current members: ${inlineCode(guild.memberCount)}`
        });
    },
};