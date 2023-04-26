const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Colours } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('icon')
    .setDescription('Gets the server\'s icon.')
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild } = interaction;
        
        const IconEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setAuthor({ name: `${guild.name}'s Icon`, iconURL: `${guild.iconURL()}` })
        .setImage(`${guild.iconURL({ size: 512, extension: 'png' })}`)

        interaction.reply({ 
            embeds: [IconEmbed],
        });
    },
};