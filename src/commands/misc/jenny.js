const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const wait = require('node:timers/promises').setTimeout;
require('dotenv/config');

const OPENAI_KEY = process.env.OPENAI_TOKEN;
const JENNY_PROMPT = process.env.JENNY_PROMPT;
const POWER_PROMPT = process.env.POWER_PROMPT;

const configuration = new Configuration({ apiKey: OPENAI_KEY });
const openai = new OpenAIApi(configuration);

module.exports = ({
	data: new SlashCommandBuilder()
	.setName('jenny')
	.setDescription('Talk to Jenny.')
	.addStringOption(option => option
			.setName('personality')
			.setDescription('personality of the AI.')
			.setRequired(true)
			.addChoices(
				{ name : 'Power', value: 'power' },
				{ name: 'Jenny.ts', value: 'jenny' }
	))
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
		
		const Personality = options.getString('personality');
		const Message = options.getString('message');
		
		let OPENAI_PROMPT;

		if (Personality === 'power') {
			OPENAI_PROMPT = POWER_PROMPT;	
		} else if(Personality === 'jenny') {
			OPENAI_PROMPT = JENNY_PROMPT;
		};

		await interaction.deferReply();
		const response = await openai.createChatCompletion({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: `${OPENAI_PROMPT} ${Message}` }] });

		await wait(5000);
		await interaction.editReply(response.data.choices[0].message.content);
	},
})
