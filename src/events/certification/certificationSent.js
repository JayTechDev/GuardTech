const { ModalSubmitInteraction, EmbedBuilder } = require('discord.js');
const database = require('../../database/schemas/CertifySchema.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.customId === 'certify-modal') {

            const { guild, fields, member, createdTimestamp } = interaction;
            if (!member.roles.cache.has('1152347942838079548')) return;

            const linkInput = fields.getTextInputValue('link-input');
            const descriptionInput = fields.getTextInputValue('description-input');

            const data = await database.findOne({ Link: linkInput });
            if (data) return interaction.reply({ content: 'This link has already been certified.', ephemeral: true });

            const CertifiedDate = new Date(createdTimestamp).toDateString();

            interaction.deferReply();

            await database.create({
                Link: linkInput,
                Description: descriptionInput,
                CertifiedOn: CertifiedDate 
            });

            const CertifyEmbed = new EmbedBuilder()
            .setColor('Green')
            .setAuthor({ name: 'Certification Success', iconURL: `${guild.iconURL()}` })
            .setDescription([
                `- Certifying: ${linkInput}`,
                `- Description: ${descriptionInput}`,
            ].join('\n'))
            .setFooter({ text: 'Research. Development. Security', iconURL: `${guild.iconURL()}` })

            await wait(1000)
            interaction.editReply({ embeds: [CertifyEmbed] });
        };
    },
};