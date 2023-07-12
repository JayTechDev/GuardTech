const { ChatInputCommandInteraction, SlashCommandBuilder, Client, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('botavatar')
    .setDescription('Change the bot\'s avatar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addAttachmentOption(option => option.setName('avatar').setDescription('New avatar.').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Avatar = options.getAttachment('avatar');
        client.user.setAvatar(Avatar.url).catch(() => { interaction.reply({ content: 'Unable to update avatar, maybe the attachment you provided is unsupported.', ephemeral: true }) });

        interaction.reply({ content: `Avatar has been changed to ${Avatar.url}` });
    },
};