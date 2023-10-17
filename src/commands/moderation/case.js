const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, codeBlock } = require('discord.js');
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
        .setDescription([
            `- User: ${data.UserTag} (${data.UserID})`,
            `- Moderator: ${data.Content[0].Moderator}`,
            `- Date: ${data.Content[0].PunishmentDate}`,
        ].join('\n'))
        .setFields(
            { name: `Reason`, value: `${codeBlock(data.Content[0].Reason)}` }
        )

        if (data.Content[0].Duration) {
            CaseEmbed
            .setDescription([
                `- User: ${data.UserTag} (${data.UserID})`,
                `- Moderator: ${data.Content[0].Moderator}`,
                `- Date: ${data.Content[0].PunishmentDate}`,
                `- Duration: ${data.Content[0].Duration}`,
            ].join('\n'))
            .setFields(
                { name: `Reason`, value: `${codeBlock(data.Content[0].Reason)}` }
            )
        };

        interaction.reply({ embeds: [CaseEmbed] });
    },
};
