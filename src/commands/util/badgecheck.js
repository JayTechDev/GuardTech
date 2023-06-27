const { ChatInputCommandInteraction, SlashCommandBuilder, userMention } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('badgecheck')
    .setDescription('Check for a certain badge.')
    .setDMPermission(false)
    .addStringOption(option => option.setName('badge').setDescription('Badge to check for.').setRequired(true).addChoices(
        { name: 'Staff', value: 'Staff' },
        { name: 'Partner', value: 'Partner' },
        { name: 'Certified Moderator', value: 'CertifiedModerator' },
        { name: 'Verified Bot', value: 'VerifiedBot', },
        { name: 'Early Supporter', value: 'EarlySupporter' },
        { name: 'Verified Bot Developer', value: 'VerifiedBotDeveloper' },
        { name: 'Active Developer', value: 'ActiveDeveloper' }
    )),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const Badge = options.getString('badge');

        await interaction.deferReply({ ephemeral: true });

        const members = [];
        guild.members.cache.forEach(member => {
            if (member.user.flags.toArray().includes(Badge)) members.push(member.user.username);
        });

        if (members.length === 0) members.push('No members.');

        try {
            await wait(1000);
            interaction.editReply({ content: ` ## Members with the **${Badge}** badge:\n${members.join(', ')}` });
        } catch (error) {
            await wait(1000);
            return interaction.editReply({ content: `There are too many people with the badge: ${Badge}` });
        };
    },
};