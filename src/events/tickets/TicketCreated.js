const { StringSelectMenuInteraction, EmbedBuilder, ChannelType, ThreadAutoArchiveDuration, channelMention, roleMention } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {StringSelectMenuInteraction} interaction
     */
    async execute(interaction, client) {
        if (!interaction.isStringSelectMenu() || !interaction.customId === 'ticket-category') return;

        const { guild, user } = interaction;

        const TicketChannel = guild.channels.cache.get('1063796552679829594');

        let Category = '';
        interaction.values.forEach(value => { Category = value });

        switch (Category) {
            case 'report-user':
                const ReportThread = await TicketChannel.threads.create({
                    name: `User Report - ${user.username}`,
                    type: ChannelType.PrivateThread,
                    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                    invitable: false
                });

                await ReportThread.join();
                await ReportThread.members.add(user.id);

                ReportThread.send({ content: `${roleMention('929382693916008478')}\n> Whilst you wait for a response, describe your issue in detail.` });
                interaction.reply({ content: `Ticket opened in: ${channelMention(ReportThread.id)}`, ephemeral: true })
                break;
            case 'server-inquiry':
                const InquiryThread = await TicketChannel.threads.create({
                    name: `Server Inquiry - ${user.username}`,
                    type: ChannelType.PrivateThread,
                    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                    invitable: false
                });

                await InquiryThread.join();
                await InquiryThread.members.add(user.id);

                InquiryThread.send({ content: `${roleMention('929382693916008478')}\n> Whilst you wait for a response, explain your inquiry in detail.` });
                interaction.reply({ content: `Ticket opened in: ${channelMention(InquiryThread.id)}`, ephemeral: true })
                break;
            case 'host-giveaway':
                const GiveawayThread = await TicketChannel.threads.create({
                    name: `Host Giveaway - ${user.username}`,
                    type: ChannelType.PrivateThread,
                    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                    invitable: false
                });

                await GiveawayThread.join();
                await GiveawayThread.members.add(user.id);

                GiveawayThread.send({ content: `${roleMention('929382693916008478')}\n- Prize\n- Winners\n- Duration\n- Requirements.\n- Other Notes` });
                interaction.reply({ content: `Ticket opened in: ${channelMention(GiveawayThread.id)}`, ephemeral: true })
                break;
                break;
        };
    },
};