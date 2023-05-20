const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
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
        const BanReason = options.getString('reason') || 'No reason provided.';

        const BanDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();

        if (!TargetMember.bannable) return interaction.reply({ 
            content: `${Emojis.Error_Emoji} Unable to perform action.`
        });

        const DirectMessageEmbed = new EmbedBuilder()
        .setColor('Grey')
        .setDescription(`You have received a soft ban in **${guild.name}**`)
        .setFields(
            { name: 'Reason', value: `${inlineCode(BanReason)}` },
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
                UserTag: TargetUser.tag,
                Content: [
                    {
                        Moderator: user.tag,
                        PunishmentDate: BanDate,
                        Reason: BanReason,
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

             interaction.reply({ 
                content: `${Emojis.Success_Emoji} Soft Banned **${TargetUser.tag}** (Case #${CaseId})`
             });
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Softban\n**Reason**: ${BanReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};