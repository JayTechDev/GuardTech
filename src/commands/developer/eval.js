const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, codeBlock } = require('discord.js');
const { Colours } = require('../../config.json');
const util = require('util');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluate code.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption(option => option.setName('code').setDescription('Code to evaluate.').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const CodeToEval = options.getString('code');
        const EvaluatedCode = await eval(CodeToEval);
        const EvaluatedCodeResult = util.inspect(EvaluatedCode, { depth: 0 });

        const EvalEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setFields({ name: 'Input', value: `${codeBlock(CodeToEval)}` }, { name: 'Output', value: `${codeBlock(EvaluatedCodeResult)}` }, { name: 'Type', value: `${codeBlock(typeof EvaluatedCode)}` })

        interaction.reply({ embeds: [EvalEmbed] });
    },
};
