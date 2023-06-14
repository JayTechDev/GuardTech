const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode, userMention } = require('discord.js');
const { Emojis, PunishmentTypes, IDs } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warns a user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to warn.')
            .setRequired(true)
    )
    .addAttachmentOption(option => option
            .setName('evidence')
            .setDescription('Evidence for this action.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The warn reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user, createdTimestamp } = interaction;

        const TargetUser = options.getUser('target');
        const WarnEvidence = options.getAttachment('evidence');
        const WarnReason = options.getString('reason') || 'No reason provided.';

        const WarnDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();

        const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Unable to perform action.`)
        if (TargetUser.id === user.id || TargetUser.id === guild.ownerId || TargetUser.bot) return interaction.reply({ 
            embeds: [CannotDoActionEmbed]
        });
        
        const DirectMessageEmbed = new EmbedBuilder()
        .setColor('Grey')
        .setDescription(`You have received a warning in **${guild.name}**`)
        .setFields(
            { name: 'Reason', value: `${inlineCode(WarnReason)}` },
            { name: 'Evidence', value: `${WarnEvidence.url}` }
        )

        await TargetUser.send({
            embeds: [DirectMessageEmbed]
        }).catch(console.error);
        
        const warn = await database.create({
            Type: PunishmentTypes.Warn,
            CaseID: CaseId,
            GuildID: guildId,
            UserID: TargetUser.id,
            UserTag: TargetUser.username,
            Content: [
                {
                    Moderator: user.username,
                    PunishmentDate: WarnDate,
                    Reason: WarnReason,
                    Evidence: WarnEvidence.url
                }
            ],
        });

        warn.save();

        const WarnSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been warned | ${inlineCode(CaseId)}`)
        interaction.reply({ 
            embeds: [WarnSuccessEmbed]
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Orange')
        .setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: ${userMention(TargetUser.id)} | \`${TargetUser.id}\`\n**Type**: Warn\n**Reason**: ${WarnReason}`)
        .setFields({ name: 'Evidence', value: `${WarnEvidence.url}` })
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};