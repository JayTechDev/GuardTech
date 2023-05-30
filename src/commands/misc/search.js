const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Colours } = require('../../config.json');
const axios = require('axios');
require('dotenv/config');

const CX = process.env.CX;
const SEARCH_API_KEY = process.env.SEARCH_API_KEY;

module.exports = ({
	data: new SlashCommandBuilder()
	.setName('google')
	.setDescription('Search the web.')
	.addStringOption(option => option
			.setName('query')
			.setDescription('search terms.')
			.setRequired(true)
	),

	async execute(interaction){
		const { options } = interaction;
		const Query = options.getString('query');

		await interaction.deferReply();

		const response = await axios.get(`https://customsearch.googleapis.com/customsearch/v1?cx=${CX}&num=4&q=${encodeURI(Query)}&key=${SEARCH_API_KEY}`).then(response => {
			const titles = [];
			const links = [];
			for (element of response.data.items) { titles.push(element.title); links.push(element.link) }
			
			const embed = new EmbedBuilder()
			.setColor(Colours.Default_Colour)
			.setTitle('Search Results')
			.addFields(
				{ name: titles[0], value: links[0] },
				{ name: titles[1], value: links[1] },
				{ name: titles[2], value: links[2] },
				{ name: titles[3], value: links[3] }
			);

		 	interaction.editReply({ embeds: [embed]});
		});
	},
});
