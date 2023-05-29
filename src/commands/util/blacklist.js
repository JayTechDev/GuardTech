const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode, userMention } = require('discord.js');
const { Emojis, Colours, IDs } = require('../../config.json');
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/BlacklistSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Blacklist a user from using the bot.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to blacklist.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The blacklist reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const BlacklistReason = options.getString('reason') || 'No reason provided.';

        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();

        const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Unable to perform action.`)
        if (!TargetMember.manageable) return interaction.reply({
            embeds: [CannotDoActionEmbed]
        });
    
        const BlacklistSuccessEmbed = new EmbedBuilder().setColor('Orange').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been blacklisted | ${inlineCode(CaseId)}`)
        interaction.reply({ 
            embeds: [BlacklistSuccessEmbed]
        });

        const blacklist = await database.create({
            CaseID: CaseId,
            GuildID: guildId,
            UserID: TargetUser.id,
            UserTag: TargetUser.tag,
            Reason: BlacklistReason
        });

        blacklist.save();

        const LogEmbed = new EmbedBuilder()
        .setColor(Colours.Blacklisted_Colour)
        .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: ${userMention(TargetUser.id)} | \`${TargetUser.id}\`\n**Type**: Blacklist\n**Reason**: ${BlacklistReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};