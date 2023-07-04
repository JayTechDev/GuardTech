const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const API_URL = 'https://api.capy.lol/v1/capybara?json=true';
const axios = require('axios');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('capybara')
    .setDescription('Gets an image of a capybara.')
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        interaction.deferReply();

        await wait(1000);
        axios.get(API_URL).then(response => {

            const CapyEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${response.data.data.alt}`)
            .setImage(`${response.data.data.url}`)

            interaction.editReply({ embeds: [CapyEmbed] });
        });
    },
};
