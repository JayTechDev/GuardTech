const { CommandInteraction, Client, EmbedBuilder, InteractionType, codeBlock } = require('discord.js');
const blacklistDB = require('../../database/schemas/BlacklistSchema.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.type == InteractionType.ApplicationCommand) {
            
            const blacklisted = await blacklistDB.findOne({ GuildID: interaction.guildId, UserID: interaction.user.id });
            if (blacklisted) return;

            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                const ErrorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setFields({ name: 'Message', value: `${codeBlock(error.message)}` }, { name: 'Stack', value: `${codeBlock(error.stack)}` })

                await interaction.reply({ embeds: [ErrorEmbed] });
            };
        };
    },
};