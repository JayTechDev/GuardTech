const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ThreadAutoArchiveDuration } = require('discord.js');
const { Colours, Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a new poll.')
    .setDMPermission(false)
    .addStringOption(option => option.setName('question').setDescription('The question to ask.').setRequired(true).setMaxLength(256).setMinLength(1)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options, user } = interaction;

        const Question = options.getString('question');

        const PollEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setDescription(`${Question}`)
        .setFooter({ text: `Poll by ${user.username}` })

        await interaction.reply({ embeds: [PollEmbed], fetchReply: true }).then(sentMessage => {
            sentMessage.react(Emojis.Success_Emoji);
            sentMessage.react(Emojis.Error_Emoji);
            sentMessage.startThread({
                name: `${Question}`,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek
            });
        });
    },
};
