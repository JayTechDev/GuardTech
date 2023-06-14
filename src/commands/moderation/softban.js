const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode, userMention } = require('discord.js');
const { Emojis, PunishmentTypes, IDs } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Ban a user from the server and then instantly unban.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to ban.')
            .setRequired(true)
    )
    .addAttachmentOption(option => option
            .setName('evidence')
            .setDescription('Evidence for this action.')
            .setRequired(true)
    )   
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The ban reason.')
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
        const BanEvidence = options.getAttachment('evidence');
        const BanReason = options.getString('reason') || 'No reason provided.';

        const BanDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();

        const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Unable to perform action.`)
        if (!TargetMember.bannable) return interaction.reply({
            embeds: [CannotDoActionEmbed]
        });

        const DirectMessageEmbed = new EmbedBuilder()
        .setColor('Grey')
        .setDescription(`You have received a soft ban in **${guild.name}**`)
        .setFields(
            { name: 'Reason', value: `${inlineCode(BanReason)}` },
            { name: 'Evidence', value: `${BanEvidence.url}` }
        )

        await TargetUser.send({
            embeds: [DirectMessageEmbed]
        }).catch(console.error);
        
        await TargetMember.ban({ deleteMessageSeconds: 86400, reason: BanReason }).then(async () => {
            const softban = await database.create({
                Type: PunishmentTypes.Softban,
                CaseID: CaseId,
                GuildID: guildId,
                UserID: TargetUser.id,
                UserTag: TargetUser.username,
                Content: [
                    {
                        Moderator: user.username,
                        PunishmentDate: BanDate,
                        Reason: BanReason,
                        Evidence: BanEvidence.url
                    }
                ],
            });

            softban.save();

            setTimeout(async () => {
                await guild.bans.fetch().then(ban => {
                    if (ban.find(user => user.user.id === TargetUser.id)) {
                        guild.bans.remove(TargetUser.id, 'Softban.');
                    };
                });
            }, 1000);
        });

        const SoftBanSuccessEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been softbanned | ${inlineCode(CaseId)}`)
        interaction.reply({ 
            embeds: [SoftBanSuccessEmbed]
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: ${userMention(TargetUser.id)} | \`${TargetUser.id}\`\n**Type**: Softban\n**Reason**: ${BanReason}`)
        .setFields({ name: 'Evidence', value: `${BanEvidence.url}` })
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};