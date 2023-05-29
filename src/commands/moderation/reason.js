const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
const { Emojis } = require('../../config.json');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reason')
    .setDescription('Add or update a reason for a case.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addStringOption(option => option
            .setName('id')
            .setDescription('The id of the case.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for the case.')
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guildId, options } = interaction;

        const CaseId = options.getString('id');
        const NewReason = options.getString('reason');

        const data = await database.findOne({ GuildID: guildId, CaseID: CaseId });
        
        const NoCaseEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Could not find a case with ID ${inlineCode(CaseId)}`)
        if (!data) return interaction.reply({
            embeds: [NoCaseEmbed]
        });
        
        await database.findOneAndUpdate({ GuildID: guildId, CaseID: CaseId }, { $set: { "Content.0.Reason": NewReason } }).then(async () => {
            const CaseUpdatedEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Emojis.Success_Emoji} Case ${inlineCode(CaseId)} has been updated with reason ${inlineCode(NewReason)}`)
            interaction.reply({ 
                embeds: [CaseUpdatedEmbed]
            });
        });
    },
};