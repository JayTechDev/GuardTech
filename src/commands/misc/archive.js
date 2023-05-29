const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, channelMention } = require('discord.js');
const { Emojis, IDs } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('archive')
    .setDescription('Archive a channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false)
    .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel to archive.')
            .addChannelTypes(ChannelType.GuildText)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, channel } = interaction;

        const Channel = options.getChannel('channel') || channel;
        const ArchiveCategory = guild.channels.cache.get(IDs.ArchiveCategory);

        Channel.permissionOverwrites.edit(guildId, { ViewChannel: false, SendMessages: null });
        Channel.setParent(ArchiveCategory);

        const ArchiveSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Emojis.Success_Emoji} ${channelMention(Channel.id)} has been archived.`)
        interaction.reply({
            embeds: [ArchiveSuccessEmbed]
        })
    },
};