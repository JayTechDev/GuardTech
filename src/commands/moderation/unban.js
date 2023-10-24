const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode, userMention } = require('discord.js');
const { Emojis, PunishmentTypes, IDs } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addStringOption(option => option.setName('target').setDescription('User to unban (ID).').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The unban reason.').setMaxLength(1000).setMinLength(1)),
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

        const NoBanEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Could not find a ban for this user, are you sure they are banned?`)
        if (!bannedId) return interaction.reply({ embeds: [NoBanEmbed] });

        interaction.deferReply();

        await guild.bans.remove(TargetID, UnbanReason).then(async () => {
            await database.create({
                Type: PunishmentTypes.Unban,
                CaseID: CaseId,
                GuildID: guildId,
                UserID: TargetID,
                Content: [{ Moderator: user.username, PunishmentDate: UnbanDate, Reason: UnbanReason }]
            });
        });

        await wait(1000);
        const UnbanSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetID)} has been unbanned | ${inlineCode(CaseId)}`)
        interaction.editReply({ embeds: [UnbanSuccessEmbed] });

        const LogEmbed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription([
            `- User: ${userMention(TargetID)} (${TargetID})`,
            `- Type: Unban`,
            `- Reason: ${UnbanReason}`,
        ].join('\n'))
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};
