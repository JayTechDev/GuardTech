const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('gayrate')
    .setDescription('How gay is a member?')
    .setDMPermission(false)
    .addUserOption(option => option.setName('target').setDescription('Member to rate.').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
        const { options } = interaction;

        const TargetUser = options.getUser('target');
        const GayRating = Math.round(Math.random() * 100) + 1;

        const GayEmbed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({ name: `Gay rating for ${TargetUser.username}`, iconURL: `${TargetUser.displayAvatarURL()}` })
        .setDescription(`${GayRating.toString()}%`)

        interaction.reply({ embeds: [GayEmbed] })
    },
};