const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, codeBlock } = require('discord.js');
const { Colours } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Gets information on a user.')
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('The user.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild, options, user } = interaction;

        const TargetUser = options.getUser('target') || user;
        const TargetMember = await guild.members.fetch(TargetUser.id);

        const UserBanner = (await client.users.fetch(TargetUser, { force: true })).bannerURL({ size: 2048 }) || null;
        const UserRoles = TargetMember.roles.cache.sort((a, b) => b.position - a.position).map((r) => r).join(' ').replace('@everyone, " "');
        const RoleSize = TargetMember.roles.cache.size;

        const InfoEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setAuthor({ name: `${TargetUser.tag}`, iconURL: `${TargetUser.displayAvatarURL()}` })
        .setThumbnail(`${TargetUser.displayAvatarURL()}`)
        .setImage(UserBanner)
        .setFields(
            {
                name: '• Username',
                value: codeBlock(TargetUser.tag),
                inline: true
            },
            {
                name: '• ID',
                value: codeBlock(TargetUser.id),
                inline: true
            },
            {
                name: '• Creation',
                value: `<t:${parseInt(TargetUser.createdTimestamp / 1000)}:R>`
            },
            {
                name: '• Joined Server',
                value: `<t:${parseInt(TargetMember.joinedTimestamp / 1000)}:R>`
            },
            {
                name: '• Type',
                value: codeBlock(TargetUser.bot ? 'Bot' : 'User'),
                inline: true
            },
            {
                name: '• Nickname',
                value: codeBlock(TargetMember.nickname || "None"),
                inline: true
            },
            {
                name: `• Roles [${RoleSize}]`,
                value: UserRoles
            },
        )

        interaction.reply({ 
            embeds: [InfoEmbed] 
        });
    },
};
