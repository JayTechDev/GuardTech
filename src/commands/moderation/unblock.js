const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, ChannelType, userMention } = require('discord.js');
const { Emojis } = require('../../config.json');
const database = require('../../database/schemas/BlockSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unblock')
    .setDescription('Unblock a user from speaking in a channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to unblock.')
            .setRequired(true)
    )
    .addChannelOption(option => option
            .setName('channel')
            .setDescription('Channel to unblock the user from.')
            .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The unblock reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, channel } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const UnblockChannel = options.getChannel('channel') || channel;
        const UnblockReason = options.getString('reason') || 'No reason provided.';

        const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Unable to perform action.`)
        if (!TargetMember.moderatable || !await database.findOne({ GuildID: guildId, UserID: TargetUser.id })) return interaction.reply({
            embeds: [CannotDoActionEmbed]
        });

        UnblockChannel.permissionOverwrites.delete(TargetUser.id).then(async () => {
            await database.deleteOne({ GuildID: guildId, UserID: TargetUser.id });
        });

        const UnblockSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been unblocked | ${inlineCode(UnblockReason)}`)
        interaction.reply({ 
            embeds: [UnblockSuccessEmbed]
        });
    },
};