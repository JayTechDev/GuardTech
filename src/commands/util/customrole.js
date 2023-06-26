const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('custom-role')
    .setDescription('Creates a custom role.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false)
    .addUserOption(option => option.setName('user').setDescription('User to give the role to.').setRequired(true))
    .addStringOption(option => option.setName('name').setDescription('Name of the role.').setRequired(true))
    .addStringOption(option => option.setName('colour').setDescription('Role colour.').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const TargetUser = options.getUser('user');
        const TargetMember = await guild.members.fetch(TargetUser.id);

        const RoleName = options.getString('name');
        const RoleColour = options.getString('colour');
        const Divider = await guild.roles.fetch('1052436531551412244');

        const ErrorEmbed = new EmbedBuilder().setColor('Red')
        if (!RoleColour.includes('#')) return interaction.reply({ embeds: [ErrorEmbed.setDescription(`${Emojis.Error_Emoji} Invalid hex colour provided, make sure it includes a #`)] });
        if (!TargetMember.manageable) return interaction.reply({ embeds: [ErrorEmbed.setDescription(`${Emojis.Error_Emoji} I cannot give this user roles.`)] });

        const CustomRole = await guild.roles.create({
            name: RoleName,
            color: RoleColour,
            mentionable: false,
            position: Divider.position - 1
        });

        TargetMember.roles.add(CustomRole);

        const CRSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Emojis.Success_Emoji} Role has been created and given to ${userMention(TargetUser.id)}`)
        interaction.reply({ embeds: [CRSuccessEmbed] });
    },
};