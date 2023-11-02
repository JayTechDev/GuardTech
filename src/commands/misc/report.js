const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { reportUser, reportMessage } = require('../../util/reportingContent');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report content.')
    .setDMPermission(false)
    .addSubcommand(subcmd => subcmd
        .setName('user')
        .setDescription('Report a user.')
        .addUserOption(option => option.setName('user').setDescription('The user you want to report.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for reporting.').setRequired(true))
    )
    .addSubcommand(subcmd => subcmd
        .setName('message')
        .setDescription('Report a message.')
        .addStringOption(option => option.setName('message_id').setDescription('The message id (Must have Developer Mode enabled for this).').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for reporting.').setRequired(true))
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options, user, channel } = interaction;

        switch (options.getSubcommand()) {
            case 'user':
                const ReportedUser = options.getUser('user');
                const ReportUserReason = options.getString('reason');

                reportUser({ guild: guild, reporter: user, user: ReportedUser, reason: ReportUserReason })
                interaction.reply({ content: 'This user has been reported and we will look into it, thanks!', ephemeral: true });
                break;

            case 'message':
                const ReportedMessage = options.getString('message_id');
                const ReportMessageReason = options.getString('reason');

                reportMessage({ id: ReportedMessage, reporter: user, channel: channel, reason: ReportMessageReason })
                .then(() => {
                    interaction.reply({ content: 'This message has been reported and we will look into it, thanks!', ephemeral: true });
                })
                .catch(() => {
                    interaction.reply({ content: 'Hmm.. something went wrong apparently, are you sure the message id is correct and it exists?', ephemeral: true });
                });
                break;
        };
    },
};
