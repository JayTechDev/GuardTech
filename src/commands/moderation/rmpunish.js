const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Emojis } = require('../../config.json');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rmpunish')
    .setDescription('Remove a punishment.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addStringOption(option => option
            .setName('id')
            .setDescription('Punishment ID.')
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guildId, options } = interaction;

        const PunishmentID = options.getString('id');
        const data = await database.findOne({ GuildID: guildId, CaseID: PunishmentID });

        if (!data) return interaction.reply({ 
            content: `${Emojis.Error_Emoji} No punishment found.`
        });
        
        database.deleteOne({ GuildID: guildId, CaseID: PunishmentID }).then(() => {
            interaction.reply({ 
                content: `${Emojis.Success_Emoji} Punishment has been removed.`
             });
        }); 
    },
};