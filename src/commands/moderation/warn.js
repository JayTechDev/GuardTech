const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
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
        const WarnReason = options.getString('reason') || 'No reason provided.';

        const WarnDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();

        if (TargetUser.id === user.id || TargetUser.id === guild.ownerId) return interaction.reply({ 
            content: `${Error_Emoji} Unable to perform action.`
        });
        
        const DirectMessageEmbed = new EmbedBuilder()
        .setColor('Grey')
        .setDescription(`You have received a warning in **${guild.name}**`)
        .setFields(
            { name: 'Reason', value: `${inlineCode(WarnReason)}` },
        )

        await TargetUser.send({
            embeds: [DirectMessageEmbed]
        }).catch(console.error);
        
        const warn = await database.create({
            Type: PunishmentTypes.Warn,
            CaseID: CaseId,
            GuildID: guildId,
            UserID: TargetUser.id,
            UserTag: TargetUser.tag,
            Content: [
                {
                    Moderator: user.tag,
                    PunishmentDate: WarnDate,
                    Reason: WarnReason
                }
            ],
         });

         warn.save();

        await interaction.reply({ 
            content: `${Emojis.Success_Emoji} Warned **${TargetUser.tag}** (Case #${CaseId})`
         });

        const LogEmbed = new EmbedBuilder()
        .setColor('Orange')
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**Type**: Warn\n**Reason**: ${WarnReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        await LogChannel.send({ embeds: [LogEmbed] });
    },
};