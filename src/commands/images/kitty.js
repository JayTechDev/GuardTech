const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const API_URL = 'https://api.thecatapi.com/v1/images/search';
const axios = require('axios');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kitty')
    .setDescription('Gets an image of a kitty.')
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        interaction.deferReply();

        await wait(1000);
        axios.get(API_URL).then(response => {

            const KittyEmbed = new EmbedBuilder()
            .setColor('Random')
            .setImage(`${response.data[0].url}`)

            interaction.editReply({ content: 'Found a cat!', embeds: [KittyEmbed] });
        });
    },
};
