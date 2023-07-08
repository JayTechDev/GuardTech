const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const API_URL = 'https://nekos.best/api/v2/neko';
const axios = require('axios');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('neko')
    .setDescription('you disgust me.')
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        await interaction.deferReply();
        
        await wait(1000);
        axios.get(API_URL).then(response => {
            const NekoEmbed = new EmbedBuilder()
            .setColor('Random')
            .setImage(`${response.data.results[0].url}`)

            interaction.editReply({ embeds: [NekoEmbed] });
        });
    },
};
