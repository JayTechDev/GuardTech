const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder } = require('discord.js');
const { Requirements } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eligible')
        .setDescription('Check if you are eligible for a benefit.')
        .setDMPermission(false)
        .addSubcommand(subcmd => subcmd
            .setName('celebrity')
            .setDescription('Check if you are eligible for the celebrity role.')
            .addNumberOption(option => option
                .setName('value')
                .setDescription('How many subscribers or followers you have.')
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName('views')
                .setDescription('How many views on YouTube?')
            )
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;

        switch (options.getSubcommand()) {
            case 'celebrity':
                const Count = options.getNumber('value');
                const Views = options.getNumber('views');

                let Eligible;
                const Issues = [];

                if (Count && !Views) {
                    if (Count < Requirements.Celebrity.Required_Count) {
                        Eligible = false;
                        Issues.push('Missing required amount of subscribers/followers.');

                        const NotEligibleEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Not Eligible')
                        .setDescription(`You are not eligible for the celebrity role, issues have been listed below.\n\n${Issues.join('\n')}`)

                        interaction.reply({
                            embeds: [NotEligibleEmbed]
                        });
                    } else {
                        const EligibleEmbed = new EmbedBuilder()
                            .setColor('Green')
                            .setTitle('Eligible')
                            .setDescription(`You are eligible for the celebrity role! Please open a ticket to proceed.`)

                        interaction.reply({
                            embeds: [EligibleEmbed]
                        });
                    };
                } else {
                    if (Count < Requirements.Celebrity.Required_Count) {
                        Eligible = false;
                        Issues.push('Missing required amount of subscribers/followers.');
                    };

                    if (Views < Requirements.Celebrity.Required_Count) {
                        Eligible = false;
                        Issues.push('Missing required amount of views.');
                    };

                    if (Eligible === false) {
                        const NotEligibleEmbed = new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('Not Eligible')
                            .setDescription(`You are not eligible for the celebrity role, issues have been listed below.\n\n${Issues.join('\n')}`)

                        interaction.reply({
                            embeds: [NotEligibleEmbed]
                        });
                    } else {
                        const EligibleEmbed = new EmbedBuilder()
                            .setColor('Green')
                            .setTitle('Eligible')
                            .setDescription(`You are eligible for the celebrity role! Please open a ticket to proceed.`)

                        interaction.reply({
                            embeds: [EligibleEmbed]
                        });
                    };
                };
                break;

        };
    },
};
