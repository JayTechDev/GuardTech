const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Emojis, PunishmentTypes, IDs } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addStringOption(option => option
            .setName('target')
            .setDescription('User to unban (ID).')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The unban reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user, createdTimestamp } = interaction;

        const TargetID = options.getString('target');
        const UnbanReason = options.getString('reason') || 'No reason provided.';

        const UnbanDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();
        const Bans = await guild.bans.fetch();

        let bannedId = Bans.find(ban => ban.user.id == TargetID);
        if (!bannedId) return interaction.reply({
            content: `${Emojis.Error_Emoji} Could not find a ban for this user.`
        });

        await guild.bans.remove(TargetID, UnbanReason).then(async () => {
            const unban = await database.create({
                Type: PunishmentTypes.Unban,
                CaseID: CaseId,
                GuildID: guildId,
                UserID: TargetUser.id,
                UserTag: TargetUser.tag,
                Content: [
                    {
                        Moderator: user.tag,
                        PunishmentDate: UnbanDate,
                        Reason: UnbanReason
                    }
                ],
             });

             unban.save();

             interaction.reply({
                content: `${Emojis.Success_Emoji} Unbanned user sucessfully. (Case #${CaseId})`
            });
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetID}> | \`${TargetID}\`\n**Type**: Unban\n**Reason**: ${UnbanReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};