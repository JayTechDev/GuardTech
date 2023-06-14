const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode, userMention } = require('discord.js');
const { Emojis, Links, PunishmentTypes, IDs } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutes a user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to mute.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('duration')
            .setDescription('The mute duration (1d, 10m, 6h).')
            .setRequired(true)
    )
    .addAttachmentOption(option => option
            .setName('evidence')
            .setDescription('Evidence for this action.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The mute reason.')
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
        const MuteDuration = options.getString('duration');
        const MuteEvidence = options.getAttachment('evidence');
        const MuteReason = options.getString('reason') || 'No reason provided.';

        const MuteDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();
        const MuteExpiry = ms(ms(MuteDuration), { long: true });
        
        const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Unable to perform action.`)
        if (!TargetMember.moderatable || !TargetMember.isCommunicationDisabled() == false) {
            return interaction.reply({
                embeds: [CannotDoActionEmbed]
            });
        };
        
        const DirectMessageEmbed = new EmbedBuilder()
        .setColor('Grey')
        .setDescription(`You have received a mute in **${guild.name}**`)
        .setFields(
            { name: 'Reason', value: `${inlineCode(MuteReason)}` },
            { name: 'Evidence', value: `${MuteEvidence.url}` },
            { name: 'Expiry', value: `${MuteExpiry}` },
            { name: 'Appeal', value: `${Links.Appeal_Link}` }
        )

        await TargetUser.send({
            embeds: [DirectMessageEmbed]
        }).catch(console.error);

        await TargetMember.timeout(ms(MuteDuration), MuteReason).then(async () => {
             const mute = await database.create({
                Type: PunishmentTypes.Mute,
                CaseID: CaseId,
                GuildID: guildId,
                UserID: TargetUser.id,
                UserTag: TargetUser.username,
                Content: [
                    {
                        Moderator: user.username,
                        PunishmentDate: MuteDate,
                        Reason: MuteReason,
                        Duration: MuteDuration,
                        Evidence: MuteEvidence.url
                    }
                ],
             });

            mute.save();
        });

        const MuteSuccessEmbed = new EmbedBuilder().setColor('Yellow').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been muted for **${MuteExpiry}** | ${inlineCode(CaseId)}`)
        await interaction.reply({ 
            embeds: [MuteSuccessEmbed]
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Yellow')
        .setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: ${userMention(TargetUser.id)} | \`${TargetUser.id}\`\n**Type**: Mute\n**Expires**: ${MuteExpiry}\n**Reason**: ${MuteReason}`)
        .setFields({ name: 'Evidence', value: `${MuteEvidence.url}` })
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};
