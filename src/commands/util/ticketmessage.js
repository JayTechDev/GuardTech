const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Colours } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticketmessage')
    .setDescription('Sends the currently configured ticket message. ')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild } = interaction;

        const TicketChannel = guild.channels.cache.get('1063796552679829594');

        const TicketCategorys = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('ticket-category')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions(
                { label: 'Report', description: 'Report a user.', value: 'report-user' },
                { label: 'Server Inquiry', description: 'Questions about the server.', value: 'server-inquiry' },
                { label: 'Giveaway', description: 'Host a giveaway.', value: 'host-giveaway' }
            )
        )

        const TicketMessageEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setDescription('Open a ticket with one of the categories listed.\n\n**Note: Making troll tickets will end in punishments.**')
        .setThumbnail(`${guild.iconURL()}`)

        TicketChannel.send({ embeds: [TicketMessageEmbed], components: [TicketCategorys] });
        interaction.reply({ content: 'Sent.', ephemeral: true });
    },
};