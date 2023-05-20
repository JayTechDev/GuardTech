const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
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
        const MuteReason = options.getString('reason') || 'No reason provided.';

        const MuteDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();
        const MuteExpiry = ms(ms(MuteDuration), { long: true });
        
        if (!TargetMember.moderatable || !TargetMember.isCommunicationDisabled() == false) {
            return interaction.reply({
                content: `${Emojis.Error_Emoji} Unable to perform action.`
            });
        };
        
        const DirectMessageEmbed = new EmbedBuilder()
        .setColor('Grey')
        .setDescription(`You have received a mute in **${guild.name}**`)
        .setFields(
            { name: 'Reason', value: `${inlineCode(MuteReason)}` },
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
                UserTag: TargetUser.tag,
                Content: [
                    {
                        Moderator: user.tag,
                        PunishmentDate: MuteDate,
                        Reason: MuteReason,
                        Duration: MuteDuration
                    }
                ],
             });

             mute.save();

             interaction.reply({ 
                content: `${Emojis.Success_Emoji} Muted **${TargetUser.tag}** for **${MuteExpiry}** (Case #${CaseId})`
            });
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Yellow')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Mute\n**Expires**: ${MuteExpiry}\n**Reason**: ${MuteReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};