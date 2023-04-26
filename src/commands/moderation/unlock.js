const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false)
    .addChannelOption(option => option
            .setName('channel')
            .setDescription('Channel to lock.')
            .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for unlocking the channel.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guildId, options, channel } = interaction;

        const UnlockChannel = options.getChannel('channel') || channel;
        const UnlockReason = options.getString('reason') || 'No reason provided.';

        const UnlockedEmbed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Channel Unlocked')
        .setDescription('This channel has been unlocked.')
        .setFields({ name: 'Reason', value: `${UnlockReason}` })
        .setTimestamp()

        if (!UnlockChannel.permissionsFor(guildId).has('SendMessages') === false) return interaction.reply({ 
            content: `${Emojis.Error_Emoji} Channel is already unlocked.`,
            ephemeral: true
         });

        UnlockChannel.permissionOverwrites.edit(guildId, { SendMessages: null }).then(() => {
            interaction.reply({ 
                content: `${Emojis.Success_Emoji} Channel has been unlocked.`,
                ephemeral: true
            });
            UnlockChannel.send({ embeds: [UnlockedEmbed] });
        });
    },
};