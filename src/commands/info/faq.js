const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Send a faq question.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addStringOption(option => option.setName('question').setDescription('The question.').setRequired(true).addChoices(
        { name: 'How do I become staff?', value: 'become-staff' },
        { name: 'What is JayCord?', value: 'what-jaycord' }
    )),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Question = options.getString('question');
        
        switch (Question) {
            case 'become-staff':
                interaction.reply({ content: '**How do I become staff?**\n> Wait until applications are open, that\'s pretty much it.' });
                break;
            case 'what-jaycord':
                interaction.reply({ content: '**What is JayCord?**\n> i forgot.' });
                break;
        };
    },
};
