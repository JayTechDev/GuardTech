const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Emojis, Colours } = require('../../config.json');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('cases')
    .setDescription('List a user\'s cases.')
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('Target to show cases for.')
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Target = options.getUser('target');

        const data = await database.find({ UserID: Target.id });
        
        if (data.length < 1) return interaction.reply({
            content: `${Emojis.Error_Emoji} No cases found for **${Target.tag}**`
        });

        const fields = [];
        data.forEach(c => fields.push({ 
            name: `Type: ${c.Type} | ID: ${c.CaseID} | Moderator: ${c.Content[0].Moderator}`, 
            value: `**${c.Content[0].PunishmentDate}:** ${c.Content[0].Reason}` 
        }));

        const CasesEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setAuthor({ name: `${Target.tag}'s Cases`, iconURL: `${Target.displayAvatarURL()}` })
        .setFields(fields);

        interaction.reply({
            embeds: [CasesEmbed]
        });
    },
};