const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv/config");
const wait = require('node:timers/promises').setTimeout;

const openaiapikey = process.env.OPENAI_TOKEN;
const prompt = process.env.PROMPT;

const configuration = new Configuration({apiKey: openaiapikey });

const openai = new OpenAIApi(configuration);

module.exports = ({
	data: new SlashCommandBuilder().setName("jenny")
	.setDescription("Talk to jenny")
	.addStringOption(option => option.setName("message")
		.setDescription("What you want to say to Jenny")
		.setRequired(true)
	),

	async execute(interaction){
		const { options } = interaction;

		await interaction.deferReply();

		const responseAI = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: `${prompt} ${options.getString("message")}`}]
		});

		await wait(10000);
		console.log(responseAI.data.choices[0].message.content);
		await interaction.editReply(responseAI.data.choices[0].message.content);
	},
})
