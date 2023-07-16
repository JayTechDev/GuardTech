const { ChatInputCommandInteraction, SlashCommandBuilder, codeBlock, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('url')
	.setDescription('URL encode or decode a string.')
	.addStringOption(option => option.setName('text').setDescription('String to be encoded or decoded.').setRequired(true))
	.addStringOption(option => option.setName('method').setDescription('Method to use').addChoices({ name: 'Encode', value: 'encode' }, { name: 'Decode', value: 'decode' }).setRequired(true)),

	async execute(interaction) {
		const { options } = interaction;

		const Text = options.getString('text');
		const Method = options.getString('method');
		let Output = '';

		if (Method == 'encode'){
			Output = encodeURIComponent(Text);
		} else if (Method == 'decode'){
			Output = decodeURI(Text);
		};
		
		const Embed = new EmbedBuilder()
		.setColor(0x000000)
		.addFields(
			{ name: 'Input', value: codeBlock(Text) },
			{ name: 'Output', value: codeBlock(Output)}
		);


		await interaction.reply( { embeds : [Embed] });
	}


}
