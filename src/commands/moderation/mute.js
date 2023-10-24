const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode, userMention } = require('discord.js');
const { Emojis, Links, PunishmentTypes, IDs } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');
const ms = require('ms');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutes a user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(option => option.setName('target').setDescription('User to mute.').setRequired(true))
    .addStringOption(option => option.setName('duration').setDescription('The mute duration (1d, 10m, 6h).').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The mute reason.').setMaxLength(1000).setMinLength(1)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user, createdTimestamp } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const MuteDuration = options.getString('duration');
        const MuteReason = options.getString('reason') || 'No reason provided.';
        const MuteExpiry = ms(ms(MuteDuration), { long: true });

        const MuteDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();
        
        const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} I cannot mute this user OR they are already muted.`)
        if (!TargetMember.moderatable || !TargetMember.isCommunicationDisabled() == false) return interaction.reply({ embeds: [CannotDoActionEmbed] });

        interaction.deferReply();
        
        const DirectMessageEmbed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setDescription(`You have received a mute in **${guild.name}**`)
        .setFields({ name: 'Reason', value: `${inlineCode(MuteReason)}` }, { name: 'Appeal', value: `${Links.Appeal_Link}` })

        await TargetUser.send({ embeds: [DirectMessageEmbed] }).catch(() => {});

        await TargetMember.timeout(ms(MuteDuration), MuteReason).then(async () => {
            await database.create({
                Type: PunishmentTypes.Mute,
                CaseID: CaseId,
                GuildID: guildId,
                UserID: TargetUser.id,
                UserTag: TargetUser.username,
                Content: [{ Moderator: user.username, PunishmentDate: MuteDate, Reason: MuteReason, Duration: MuteDuration }]
            });
        });

        await wait(1000);
        const MuteSuccessEmbed = new EmbedBuilder().setColor('Yellow').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been muted | ${inlineCode(CaseId)}`)
        await interaction.editReply({ embeds: [MuteSuccessEmbed] });

        const LogEmbed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription([
            `- User: ${userMention(TargetUser.id)} (${TargetUser.id})`,
            `- Type: Mute`,
            `- Reason: ${MuteReason}`,
            `- Expiry: ${MuteExpiry}`,
        ].join('\n'))
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};
