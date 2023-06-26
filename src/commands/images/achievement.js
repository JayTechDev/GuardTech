const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const API_URL = 'https://api.alexflipnote.dev/achievement';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('achievement')
    .setDescription('Generate a Minecraft achievement.')
    .setDMPermission(false)
    .addStringOption(option => option.setName('text').setDescription('The text.').setMaxLength(100).setMinLength(1).setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const AchievementText = options.getString('text');
        const SafeString = encodeURIComponent(AchievementText);

        interaction.reply({ content: API_URL + `?text=${SafeString}` });
    },
};
