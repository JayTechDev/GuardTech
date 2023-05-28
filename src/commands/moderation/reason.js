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
        const { guild, guildId, options } = interaction;

        const CaseId = options.getString('id');
        const NewReason = options.getString('reason');

        const data = await database.findOne({ GuildID: guildId, CaseID: CaseId });
        
        if (!data) return interaction.reply({
            content: `${Emojis.Error_Emoji} No case found.`
        });
        
        await database.findOneAndUpdate({ GuildID: guildId, CaseID: CaseId }, { $set: { "Content.0.Reason": NewReason } }).then(async () => {
            interaction.reply({ 
                content: `${Emojis.Success_Emoji} Case ${inlineCode(CaseId)} has been updated with reason ${inlineCode(NewReason)}`
            });
        });
    },
};