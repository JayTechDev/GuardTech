const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, codeBlock } = require('discord.js');
const { Colours } = require('../../config.json');

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

        const EvalEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setFields({ name: 'Input', value: `${codeBlock(CodeToEval)}`, inline: true }, { name: 'Output', value: `${codeBlock(EvaluatedCode)}`, inline: true }, { name: 'Type', value: `${codeBlock(typeof EvaluatedCode)}` })

        interaction.reply({ embeds: [EvalEmbed] });
    },
};
