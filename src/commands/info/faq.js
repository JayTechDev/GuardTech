const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Send a faq question.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addStringOption(option => option.setName('question').setDescription('The question.').setRequired(true).addChoices(
        { name: 'How do I become staff?', value: 'become-staff' },
        { name: 'What is JayCord?', value: 'what-jaycord' },
        { name: 'I need to report someone', value: 'reporting-user' },
        { name: 'I want to appeal a punishment', value: 'appeal-punishment' }
    )),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Question = options.getString('question');
        
        switch (Question) {
            case 'become-staff':
                interaction.reply({ content: '**How do I become staff?**\n> Staff Applications will be announced whenever we are in need of more staff, asking/begging for it will not help you in any way possible so don\'t try it.' });
                break;
            case 'what-jaycord':
                interaction.reply({ content: '**What is JayCord?**\n> Our entire goal of JayCord is to bring users from all different platforms together for a place to hangout and socialise with eachother. We also offer different forums for different topics like showcasing, feedback on anything you make and a whole lot more.' });
                break;
            case 'reporting-user':
                interaction.reply({ content: '**I need to report someone**\n> If you need to report someone to us please open a report ticket and explain everything that happened and we will deal with it accordingly.\n- If it is a Discord issue please report the user to discord they will deal with it.' });
                break;
            case 'appeal-punishment':
                interaction.reply({ content: '**I want to appeal a punishment**\n> If you would like to appeal your ban or mute and be given a second chance head over to our appeal form located [here](https://dyno.gg/form/b72ba489).' });
                break;
        };
    },
};
