const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
const { Emojis } = require('../../config.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('bansearch')
    .setDescription('Search for a ban.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addStringOption(option => option
            .setName('target')
            .setDescription('User to search for (ID).')
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const Target = options.getString('target');

        await interaction.deferReply();

        const Bans = await guild.bans.fetch();
        const UserBan = Bans.find(ban => ban.user.id == Target);

        const NoBanEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} No ban matching ${inlineCode(Target)}`)
        if (!UserBan) return interaction.editReply({
            embeds: [NoBanEmbed]
        });

        await wait(1000);
        interaction.editReply({
            content: inlineCode(`${UserBan.user.tag} (${UserBan.user.id}) | ${UserBan.reason} `)
        });
    },
};