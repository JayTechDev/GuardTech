const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const wait = require('node:timers/promises').setTimeout;
require('dotenv/config');

const OPENAI_KEY = process.env.OPENAI_TOKEN;
const OPENAI_PROMPT = process.env.PROMPT;

const configuration = new Configuration({ apiKey: OPENAI_KEY });
const openai = new OpenAIApi(configuration);

module.exports = ({
	data: new SlashCommandBuilder()
	.setName('jenny')
	.setDescription('Talk to Jenny.')
	.addStringOption(option => option
			.setName('message')
			.setDescription('The prompt.')
			.setRequired(true)
	),
	/**
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	async execute(interaction){
		const { options } = interaction;

		const Message = options.getString('message');

		await interaction.deferReply();

		const response = await openai.createChatCompletion({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: `${OPENAI_PROMPT} ${Message}` }] });

		await wait(5000);
		await interaction.editReply(response.data.choices[0].message.content);
	},
})
