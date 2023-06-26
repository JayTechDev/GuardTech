const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, userMention } = require('discord.js');
const { Emojis, Colours } = require('../../config.json');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('cases')
    .setDescription('List a user\'s cases.')
    .setDMPermission(false)
    .addUserOption(option => option.setName('target').setDescription('Target to show cases for.').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Target = options.getUser('target');
        const data = await database.find({ UserID: Target.id });
        
        const NoCasesEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} There are no cases for ${userMention(Target.id)}`)
        if (data.length < 1) return interaction.reply({ embeds: [NoCasesEmbed] });

        const fields = [];
        data.forEach(c => fields.push({ 
            name: `Type: ${c.Type} | ID: ${c.CaseID} | Moderator: ${c.Content[0].Moderator}`, 
            value: `**${c.Content[0].PunishmentDate}:** ${c.Content[0].Reason}` 
        }));

        const CasesEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setAuthor({ name: `${Target.username}'s Cases`, iconURL: `${Target.displayAvatarURL()}` })
        .setFields(fields);

        interaction.reply({ embeds: [CasesEmbed] });
    },
};