const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder } = require('discord.js');
const { Colours } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Gets information on a user.')
    .setDMPermission(false)
    .addUserOption(option => option.setName('target').setDescription('The user.')),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild, options, user } = interaction;

        const TargetUser = options.getUser('target') || user;
        const TargetMember = await guild.members.fetch(TargetUser.id);

        const UserFlags = (await TargetUser.fetchFlags()).toArray().join(', ');
        const UserBanner = (await client.users.fetch(TargetUser, { force: true })).bannerURL({ size: 2048 }) || null;
        const UserColour = (await client.users.fetch(TargetUser, { force: true })).hexAccentColor;
        const UserRoles = TargetMember.roles.cache.sort((a, b) => b.position - a.position).map((r) => r).join(' ').replace('@everyone', ' ');

        const InfoEmbed = new EmbedBuilder()
        .setColor(UserColour || Colours.Default_Colour)
        .setAuthor({ name: `${TargetUser.username}`, iconURL: `${TargetUser.displayAvatarURL()}` })
        .setThumbnail(`${TargetUser.displayAvatarURL()}`)
        .setImage(UserBanner)
        .setDescription([
            `**User Information**`,
            `- **Global Name:** ${TargetUser.globalName}`,
            `- **Display Name:** ${TargetUser.displayName || 'None'}`,
            `- **ID:** ${TargetUser.id}`,
            `- **Creation:** <t:${parseInt(TargetUser.createdTimestamp / 1000)}:R>`,
            `- **Type:** ${TargetUser.bot ? 'Bot' : 'User'}`,
            `- **Flags:** ${UserFlags}`,
            `**Member Information**`,
            `- **Joined:** <t:${parseInt(TargetMember.joinedTimestamp / 1000)}:R>`,
            `- **Nickname:** ${TargetMember.nickname || 'None'}`,
            `- **Pending:** ${TargetMember.pending ? 'Yes' : 'No'}`,
            `- **Muted:** ${TargetMember.isCommunicationDisabled() ? 'Yes' : 'No'}`
        ].join('\n'))
        .setFields({ name: 'Roles', value: `${UserRoles}` })
        
        interaction.reply({ embeds: [InfoEmbed] });
    },
};
