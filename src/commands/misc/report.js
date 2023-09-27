const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ChannelType, roleMention } = require('discord.js');
const { IDs } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report a message.')
    .setDMPermission(false)
    .addStringOption(option => option.setName('message_id').setDescription('The message id (Must have Developer Mode enabled for this).').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for reporting.').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options, user, channel } = interaction;

        const ReportedMessage = options.getString('message_id');
        const ReportReason = options.getString('reason');

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('confirm-report').setLabel('Report').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('cancel-report').setLabel('Cancel').setStyle(ButtonStyle.Primary),
        )

        await channel.messages.fetch(ReportedMessage).then(message => {
            const { author, content, attachments, channel } = message;

            const PreviewEmbed = new EmbedBuilder()
            .setColor('Aqua')
            .setAuthor({ name: `${author.username} (${author.id})`, iconURL: `${author.displayAvatarURL()}` })
            .setDescription(content || attachments.first().url)
            .setFooter({ text: `${channel.name}`})
            .setTimestamp()

            interaction.reply({ 
                content: `You are reporting [this message](${message.url}) are you sure?\n**Reason:** ${ReportReason}`, 
                embeds: [PreviewEmbed],
                components: [Buttons],
                ephemeral: true,
                fetchReply: true
            }).then((response) => {
                response.createMessageComponentCollector({ componentType: ComponentType.Button }).on('collect', i => {
                    switch (i.customId) {
                        case 'confirm-report':
                            guild.channels.cache.get(IDs.TicketChannel).threads.create({
                                name: `Message Report - ${user.username}`,
                                type: ChannelType.PrivateThread,
                                invitable: false
                            }).then(thread => thread.send({
                                content: [
                                    `${roleMention('1119581695415427082')} ${user.username} (${user.id}) has reported a [message](${message.url}).`,
                                    `**Reason:** ${ReportReason}`
                                ].join('\n'),
                                embeds: [PreviewEmbed]
                            }));

                            i.update({ content: 'Report has been submitted.', embeds: [], components: [] });
                            break;
                        case 'cancel-report':
                            i.update({ content: 'Cancelled report.', embeds: [], components: [] });
                            break;
                    };
                });
            });
        }).catch(() => interaction.reply({ content: 'The message id you provided doesn\'t seem to exist.', ephemeral: true }))
    },
};
