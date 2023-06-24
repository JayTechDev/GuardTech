const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Emojis, Colours } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('Gets a user\'s banner.')
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('The user whose banner you want to fetch.')
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options, user } = interaction;

        const Target = options.getUser('target') || user;
        const UserBanner = (await client.users.fetch(Target, { force: true })).bannerURL({ size: 2048 }) || null;

        const NoBannerEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} No banner found for this user.`)
        if (!UserBanner) return interaction.reply({
            embeds: [NoBannerEmbed]
        })

        const AvatarEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setAuthor({ name: `${Target.username}'s Banner`, iconURL: `${Target.displayAvatarURL()}` })
        .setImage(`${UserBanner}`)

        interaction.reply({ 
            embeds: [AvatarEmbed] 
        });
    },
};