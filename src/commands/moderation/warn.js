const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode, userMention } = require('discord.js');
const { Emojis, PunishmentTypes, IDs } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warns a user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(option => option.setName('target').setDescription('User to warn.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The warn reason.').setMaxLength(1000).setMinLength(1)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user, createdTimestamp } = interaction;

        const TargetUser = options.getUser('target');
        const WarnReason = options.getString('reason') || 'No reason provided.';

        const WarnDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();
        
        const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Unable to perform action.`)
        if (TargetUser.id === user.id || TargetUser.id === guild.ownerId || TargetUser.bot) return interaction.reply({ embeds: [CannotDoActionEmbed] });

        interaction.deferReply();
        
        const DirectMessageEmbed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setDescription(`You have received a warning in **${guild.name}**`)
        .setFields({ name: 'Reason', value: `${inlineCode(WarnReason)}` })

        await TargetUser.send({ embeds: [DirectMessageEmbed] }).catch(() => {});
        
        await database.create({
            Type: PunishmentTypes.Warn,
            CaseID: CaseId,
            GuildID: guildId,
            UserID: TargetUser.id,
            UserTag: TargetUser.username,
            Content: [{ Moderator: user.username,PunishmentDate: WarnDate,Reason: WarnReason }]
        });

        await wait(1000);
        const WarnSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been warned | ${inlineCode(CaseId)}`)
        interaction.editReply({ embeds: [WarnSuccessEmbed] });

        const LogEmbed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription([
            `- User: ${userMention(TargetUser.id)} (${TargetUser.id})`,
            `- Type: Warn`,
            `- Reason: ${WarnReason}`,
        ].join('\n'))
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};
