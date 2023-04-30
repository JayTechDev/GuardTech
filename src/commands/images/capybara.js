const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const API_URL = 'https://api.capy.lol/v1/capybara?json=true';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('capybara')
        .setDescription('Gets an image of a capybara.')
        .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        fetch(API_URL, { method: 'GET' }).then(response => response.json().then(data => {
            const CapyEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${data.data.alt}`)
            .setImage(`${data.data.url}`)

            interaction.reply({
                embeds: [CapyEmbed]
            });
        }));
    },
};
