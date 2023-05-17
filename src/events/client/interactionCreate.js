const { CommandInteraction, Client, InteractionType } = require('discord.js');
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
                console.log(error);
                return interaction.reply({
                    content: '**[BOT ERROR]** Check console for more information.',
                    ephemeral: true
                });
            };
        };
    },
};