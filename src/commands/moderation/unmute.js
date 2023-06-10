const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode, userMention } = require('discord.js');
const { Emojis, PunishmentTypes, IDs } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmutes a user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to unmute.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The unmute reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user, createdTimestamp } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const UnmuteReason = options.getString('reason') || 'No reason provided.';

        const UnmuteDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();
        
        const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Unable to perform action.`)
        if (!TargetMember.moderatable || !TargetMember.isCommunicationDisabled() == true) return interaction.reply({
            embeds: [CannotDoActionEmbed]
        });

        await TargetMember.timeout(null).then(async () => {
            const unmute = await database.create({
                Type: PunishmentTypes.Unmute,
                CaseID: CaseId,
                GuildID: guildId,
                UserID: TargetUser.id,
                UserTag: TargetUser.username,
                Content: [
                    {
                        Moderator: user.username,
                        PunishmentDate: UnmuteDate,
                        Reason: UnmuteReason
                    }
                ],
            });

            unmute.save();
        });

        const UnmuteSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been unmuted | ${inlineCode(CaseId)}`)
        interaction.reply({ 
            embeds: [UnmuteSuccessEmbed]
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: ${userMention(TargetUser.id)} | \`${TargetUser.id}\`\n**Type**: Unmute\n**Reason**: ${UnmuteReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        await LogChannel.send({ embeds: [LogEmbed] });
    },
};