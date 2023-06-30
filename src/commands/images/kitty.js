const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const API_URL = 'https://api.thecatapi.com/v1/images/search';
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kitty')
        .setDescription('Gets an image of a kitty.')
        .setDMPermission(false),
    async execute(interaction, client) {
        axios.get(API_URL).then(response => {

            const KittyEmbed = new EmbedBuilder()
            .setColor('Random')
            .setImage(`${response.data[0].url}`)

            interaction.reply({ embeds: [KittyEmbed] });
        });
    },
};
