const { ChatInputCommandInteraction, SlashCommandBuilder, codeBlock } = require('discord.js');
const { Colours } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8ball a question.')
        .setDMPermission(false)
        .addStringOption(option => option
                .setName('question')
                .setDescription('The question you would like to ask the 8ball.')
                .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Question = options.getString('question');
        
        const Answers = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.',
            'No way.',
            'Maybe',
            'The answer is hiding inside you',
            'No.',
            'Depends on the mood of the CS god',
            'No',
            'Yes',
            'Hang on',
            'It\'s over',
            'It\'s just the beginning',
            'Good Luck',
        ];
        
        let index = (Math.floor(Math.random() * Math.floor(Answers.length)));
        const finalAnswer = Answers[index];

        interaction.reply({ 
            content: `Your question:\n${codeBlock(Question)}\nMy answer:\n${codeBlock(finalAnswer)}`
         });
    },
};
