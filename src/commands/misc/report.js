const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, ThreadAutoArchiveDuration, roleMention, channelMention } = require('discord.js');
const { IDs } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report a message.')
    .setDMPermission(false)
    .addStringOption(option => option.setName('message_link').setDescription('The link to the message.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for reporting.').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options, user } = interaction;

        const ReportedMessage = options.getString('message_link');
        const ReportReason = options.getString('reason');

        const ReportEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: `${user.username}'s Report`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription([
            `> **Reason:** ${ReportReason}`,
            `> **Reported Message:** [__here__](${ReportedMessage})`
        ].join('\n'))

        const ReportThread = await guild.channels.cache.get(IDs.TicketChannel).threads.create({
            name: `Message Report - ${user.username}`,
            type: ChannelType.PrivateThread,
            invitable: false,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek
        });

        ReportThread.join();
        ReportThread.members.add(user.id);
            
        ReportThread.send({ content: roleMention('929382693916008478'), embeds: [ReportEmbed] });
        interaction.reply({ content: `Report submitted in ${channelMention(ReportThread.id)}`, ephemeral: true });
    },
};
