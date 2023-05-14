const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
const { Emojis, PunishmentTypes, IDs } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to kick.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The kick reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    )
    .addBooleanOption(option => option
            .setName('notify')
            .setDescription('Whether or not to notify the target.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user, createdTimestamp } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const KickReason = options.getString('reason') || 'No reason provided.';
        const Notify = options.getBoolean('notify');

        const KickDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();

        if (!TargetMember.kickable) return interaction.reply({ 
            content: `${Emojis.Error_Emoji} Unable to kick this user.`
        });
        
        const DirectMessageEmbed = new EmbedBuilder()
        .setColor('Grey')
        .setDescription(`You have received a kick in **${guild.name}**`)
        .setFields(
            { name: 'Reason', value: `${inlineCode(KickReason)}` },
        )

        if (Notify) await TargetUser.send({
            embeds: [DirectMessageEmbed]
        }).catch(console.error);

        await TargetMember.kick(KickReason).then(async () => {
            interaction.reply({ 
                content: `${Emojis.Success_Emoji} Kicked **${TargetUser.tag}** (Case #${CaseId})`
             });

             const kick = await database.create({
                Type: PunishmentTypes.Kick,
                CaseID: CaseId,
                GuildID: guildId,
                UserID: TargetUser.id,
                UserTag: TargetUser.tag,
                Content: [
                    {
                        Moderator: user.tag,
                        PunishmentDate: KickDate,
                        Reason: KickReason
                    }
                ],
             });

             kick.save();
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Kick\n**Reason**: ${KickReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        await LogChannel.send({ embeds: [LogEmbed] });
    },
};