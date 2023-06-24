const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { Colours } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('channelinfo')
    .setDescription('Gets information on a channel.')
    .setDMPermission(false)
    .addChannelOption(option => option
            .setName('channel')
            .setDescription('Channel to get information about.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options, channel } = interaction;

        const Channel = options.getChannel('channel') || channel;

        const InfoEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setDescription([
            `**${Channel.name}**`,
            `> **ID:** ${Channel.id}`,
            `> **Type:** ${Channel.type}`,
            `> **Topic:** ${Channel.topic || 'None.'}`,
            `> **Position:** ${Channel.position}`,
            `> **Parent:** ${Channel.parent || 'None.'} (${Channel.parentId || 'No parent'})`,
            `> **Created:** <t:${parseInt(Channel.createdTimestamp / 1000)}:R>`
        ].join('\n'))

        interaction.reply({ 
            embeds: [InfoEmbed] 
        });
    },
};
