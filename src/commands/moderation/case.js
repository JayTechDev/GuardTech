const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention } = require('discord.js');
const { Emojis } = require('../../config.json');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('case')
    .setDescription('View a case.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addStringOption(option => option.setName('id').setDescription('The id of the case.').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guildId, options } = interaction;

        const CaseId = options.getString('id');
        const data = await database.findOne({ GuildID: guildId, CaseID: CaseId });

        const NoCaseEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} No case found.`)
        if (!data) return interaction.reply({ embeds: [NoCaseEmbed] });
        
        const CaseEmbed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle(`${data.Type} - Case #${data.CaseID}`)
        .setFields(
            { name: 'User', value: `${data.UserTag} (${userMention(data.UserID)})`, inline: true },
            { name: 'Moderator', value: `${data.Content[0].Moderator}`, inline: true },
            { name: `${data.Content[0].PunishmentDate}:`, value: `${data.Content[0].Reason}` }
        )

        switch (data.Type) {
            case 'Ban':
                CaseEmbed.setColor('Red')
                break;
            case 'SoftBan':
                CaseEmbed.setColor('Red')
                break;
            case 'Kick':
                CaseEmbed.setColor('Red')
                break;
            case 'Mute':
                CaseEmbed.setColor('Yellow')
                break;
            case 'Warn':
                CaseEmbed.setColor('Orange')
                break;
            case 'Unmute':
                CaseEmbed.setColor('Green')
                break;
            case 'Unban':
                CaseEmbed.setColor('Green')
                break;
        };

        if (data.Content[0].Duration) {
            CaseEmbed.setFields(
                { name: 'User', value: `${data.UserTag} (<@${data.UserID}>)`, inline: true },
                { name: 'Moderator', value: `${data.Content[0].Moderator}`, inline: true },
                { name: 'Duration', value: `${data.Content[0].Duration}`, inline: true },
                { name: `${data.Content[0].PunishmentDate}:`, value: `${data.Content[0].Reason}` }
            )
        };

        interaction.reply({ embeds: [CaseEmbed] });
    },
};