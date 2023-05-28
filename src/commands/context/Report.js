const { MessageContextMenuCommandInteraction, ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType, ThreadAutoArchiveDuration, ChannelType, inlineCode, channelMention, userMention, roleMention, messageLink } = require('discord.js');
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

        const ReportThread = await TicketChannel.threads.create({
            name: `Message Report - ${user.tag}`,
            type: ChannelType.PrivateThread,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
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
            name: '• Reported Message', value: `${targetMessage.content}`
        })

        ReportThread.send({
            content: roleMention('929382693916008478'),
            embeds: [ReportEmbed]
        });

        interaction.reply({
            content: `Your report has been submitted in ${channelMention(ReportThread.id)}`,
            ephemeral: true
        });
    },
};