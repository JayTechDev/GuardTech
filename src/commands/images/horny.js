const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('horny')
    .setDescription('Creates a horny license.')
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const { user } = interaction;
        
        const HornyEmbed = new EmbedBuilder()
        .setColor('LuminousVividPink')
        .setTitle('Here is your horny license')
        .setImage(`https://some-random-api.com/canvas/horny?avatar=${user.displayAvatarURL({ extension: 'png' })}`)

        interaction.reply({ embeds: [HornyEmbed] });
    },
};
