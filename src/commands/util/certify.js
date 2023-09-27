const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, codeBlock } = require('discord.js');
const database = require('../../database/schemas/CertifySchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('certify')
    .setDescription('Certify something from JayTech.')
    .addSubcommand(subcmd => subcmd
        .setName('get')
        .setDescription('See if something is certified.')
        .addStringOption(option => option
            .setName('link')
            .setDescription('The link.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcmd => subcmd
        .setName('create')
        .setDescription('Create a new certification.')
    )
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        
        const { guild, options } = interaction;

        switch (options.getSubcommand()) {
            case 'get':
                const link = options.getString('link');

                const data = await database.findOne({ Link: link });
                if (!data) return interaction.reply({ content: `No certfication record found for ${link}`, ephemeral: true });

                const RecordEmbed = new EmbedBuilder()
                .setColor('Orange')
                .setAuthor({ name: 'JayTech Certification', iconURL: `${guild.iconURL()}` })
                .setFields(
                    { name: 'Link', value: `${codeBlock(link)}` },
                    { name: 'Team Description', value: `${codeBlock(data.Description)}` },
                    { name: 'Certified On', value: `${codeBlock(data.CertifiedOn)}` }
                )

                interaction.reply({ embeds: [RecordEmbed] });
                break;
            case 'create':
                const CertifyModal = new ModalBuilder()
                .setCustomId('certify-modal')
                .setTitle('Certification')
        
                const LinkInput = new TextInputBuilder()
                .setCustomId('link-input')
                .setLabel('Link')
                .setPlaceholder('What you are certifying.')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(1000)
                .setRequired(true)
        
                const DescriptionInput = new TextInputBuilder()
                .setCustomId('description-input')
                .setLabel('Description')
                .setPlaceholder('Brief description.')
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(4000)
                .setRequired(true)
        
                const firstActionRow = new ActionRowBuilder().addComponents(LinkInput);
                const secondActionRow = new ActionRowBuilder().addComponents(DescriptionInput);
                CertifyModal.addComponents(firstActionRow, secondActionRow);
        
                interaction.showModal(CertifyModal);
                break;
        };
    },
};