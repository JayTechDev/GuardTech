const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, codeBlock } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluate code.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option.setName('code').setDescription('Code to evaluate.').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options, user } = interaction;

        const CodeToEval = options.getString('code');
        const EvaluatedCode = eval(CodeToEval);

        if (!user.id == '697541992770437130') return;
        interaction.reply({ content: codeBlock(EvaluatedCode) });
    },
};
