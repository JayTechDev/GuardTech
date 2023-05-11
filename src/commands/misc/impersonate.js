const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('impersonate')
    .setDescription('Send a webhook message as a user specified.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('The user to impersonate.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('message')
            .setDescription('What do you want to say?')
            .setRequired(true)
            .setMaxLength(2000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options, channel } = interaction;

        const Target = options.getUser('target');
        const Message = options.getString('message');

        guild.channels.createWebhook({ channel: channel.id, name: `${Target.username}`, avatar: `${Target.displayAvatarURL()}` }).then((webhook) => {
            webhook.send({
                content: `${Message}`
            });

            setTimeout(() => {
                webhook.delete().catch();
            }, 3000);
        });

        interaction.reply({
            content: `${Emojis.Success_Emoji} Done.`,
            ephemeral: true
        });
    },
};
