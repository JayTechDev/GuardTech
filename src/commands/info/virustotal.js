const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const VirusTotalApi = require('virustotal-api');
require('dotenv/config');

const VirusTotal = new VirusTotalApi(process.env.VIRUSTOTAL_KEY);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('virustotal')
    .setDescription('Look up a URL with Virus Total.')
    .setDMPermission(false)
    .addStringOption(option => option
            .setName('url')
            .setDescription('Look up a URL.')
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options, user } = interaction;

        const URL = options.getString('url');

        VirusTotal.urlScan(URL).then((response) => {
            const VirusTotalEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setAuthor({ name: `${user.username}'s Scan`, iconURL: `${user.displayAvatarURL()}` })
            .setDescription([
                `> **URL:** ${URL}`,
                `> **Scan ID:** ${response.scan_id}`,
                `> ** Scanned On:** ${response.scan_date}`,
            ].join('\n'))
            .setFields({
                name: 'Results', value: `[View results](${response.permalink})`
            })

            interaction.reply({
                embeds: [VirusTotalEmbed]
            }); 
        });
    },
};