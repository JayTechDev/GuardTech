const { ChatInputCommandInteraction, SlashCommandBuilder, codeBlock } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('binary')
    .setDescription('Encode or decode binary to readable human text.')
    .setDMPermission(false)
    .addStringOption(option => option.setName('text').setDescription('Text to convert.').setRequired(true))
    .addStringOption(option => option.setName('method').setDescription('Method to choose.').addChoices({ name: 'Encode', value: 'encode' }, { name: 'Decode', value: 'decode' }).setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Text = options.getString('text');
        const Method = options.getString('method');

        if (Method === 'encode') {
            const { data } = await axios.get(`https://some-random-api.com/binary?encode=${encodeURIComponent(Text)}`);
            interaction.reply({ content: `**Text:** ${codeBlock(Text)}\n\n**Output:** ${codeBlock(data.binary)}` });
        } else {
            const { data } = await axios.get(`https://some-random-api.com/binary?decode=${Text}`);
            interaction.reply({ content: `**Text:** ${codeBlock(Text)}\n\n**Output:** ${codeBlock(data.text)}` });
        };
    },
};
