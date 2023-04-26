const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purge messages from a channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addNumberOption(option => option
            .setName('amount')
            .setDescription('Amount to purge.')
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true)
    )
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to purge.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { channel, options } = interaction;

        const Amount = options.getNumber('amount');
        const Target = options.getUser('target');

        const Messages = await channel.messages.fetch();

        if(Target){
            let i = 0;
            const filtered = [];
            Messages.filter((m) => {
                if(m.author.id === Target.id && Amount > i){
                    filtered.push(m);
                    i++;
                };
            });

            await channel.bulkDelete(filtered, true).then(async messages => {
                const sentMessage = await interaction.reply({ 
                    content: `${Emojis.Success_Emoji} Purged ${messages.size} ${messages.size > 1 ? 'messages' : 'message'} sent by **${Target.tag}**`,
                    ephemeral: true
                 });
            });
        }
        else {
            await channel.bulkDelete(Amount, true).then(messages => {
                interaction.reply({ 
                    content: `${Emojis.Success_Emoji} Purged ${messages.size} ${messages.size > 1 ? 'messages' : 'message'}.`,
                    ephemeral: true
                 });
            });
        };
    },
};