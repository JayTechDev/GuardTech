const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode, userMention } = require('discord.js');
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
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user, createdTimestamp } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const KickReason = options.getString('reason') || 'No reason provided.';

        const KickDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();

        const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Unable to perform action.`)
        if (!TargetMember.kickable) return interaction.reply({
            embeds: [CannotDoActionEmbed]
        });
        
        const DirectMessageEmbed = new EmbedBuilder()
        .setColor('Grey')
        .setDescription(`You have received a kick in **${guild.name}**`)
        .setFields(
            { name: 'Reason', value: `${inlineCode(KickReason)}` },
        )

        await TargetUser.send({
            embeds: [DirectMessageEmbed]
        }).catch(console.error);

        await TargetMember.kick(KickReason).then(async () => {
            const kick = await database.create({
                Type: PunishmentTypes.Kick,
                CaseID: CaseId,
                GuildID: guildId,
                UserID: TargetUser.id,
                UserTag: TargetUser.username,
                Content: [
                    {
                        Moderator: user.username,
                        PunishmentDate: KickDate,
                        Reason: KickReason
                    }
                ],
            });

            kick.save();
        });

        const KickSuccessEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been kicked | ${inlineCode(CaseId)}`)
        interaction.reply({ 
            embeds: [KickSuccessEmbed]
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: ${userMention(TargetUser.id)} | \`${TargetUser.id}\`\n**Type**: Kick\n**Reason**: ${KickReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};