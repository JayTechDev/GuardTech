const { MessageContextMenuCommandInteraction, 
    ContextMenuCommandBuilder, 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ApplicationCommandType, 
    ThreadAutoArchiveDuration, 
    ChannelType,
    ComponentType, 
    inlineCode, 
    channelMention, 
    userMention, 
    roleMention, 
    messageLink,
} = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Report Message')
    .setType(ApplicationCommandType.Message),
    /**
     * @param {MessageContextMenuCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, targetId, targetMessage, channel, user } = interaction;

        const TicketChannel = guild.channels.cache.get('1063796552679829594');

        const images = [];
        if (targetMessage.attachments.size > 0) targetMessage.attachments.forEach(attachment => {
            images.push(attachment.url);
        });

        const ReportThread = await TicketChannel.threads.create({
            name: `Message Report - ${user.tag}`,
            type: ChannelType.PrivateThread,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            invitable: false
        });

        await ReportThread.join();
        await ReportThread.members.add(user.id);

        const ReportEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: `${user.tag}'s Report`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription([
            `> • **Reporter:** ${userMention(user.id)} (${inlineCode(user.id)})`,
            `> • **Message Link:** [here](${messageLink(channel.id, targetId)})`
        ].join('\n'))
        .setFields({
            name: '• Reported Message', value: `${targetMessage.content || images.join('\n')}`
        })

        const ReportButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('close-report').setLabel('Close').setStyle(ButtonStyle.Danger),
        )

        ReportThread.send({
            content: roleMention('1113045236088852552'),
            embeds: [ReportEmbed],
            components: [ReportButtons]
        }).then((sentMessage) => {
            sentMessage.pin();
            sentMessage.createMessageComponentCollector({ componentType: ComponentType.Button }).on('collect', async (button) => {
                if (!button.member.permissions.has('ManageMessages')) return button.reply({
                    content: 'You cannot use this.',
                    ephemeral: true
                });

                switch (button.customId) {
                    case 'close-report':
                        ReportThread.setLocked(true);
                        button.reply({
                            content: 'This report is being closed, please wait a few seconds.'
                        });

                        setTimeout(() => {
                            ReportThread.delete();
                        }, 5000);
                        break;
                };
            });
        });

        interaction.reply({
            content: `Your report has been submitted in ${channelMention(ReportThread.id)}`,
            ephemeral: true
        });
    },
};