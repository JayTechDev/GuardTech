const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false)
    .addChannelOption(option => option
            .setName('channel')
            .setDescription('Channel to lock.')
            .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for locking the channel.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guildId, options, channel } = interaction;

        const LockChannel = options.getChannel('channel') || channel;
        const LockReason = options.getString('reason') || 'No reason provided.';

        const LockedEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Channel Locked')
        .setDescription('This channel has been locked, you are not muted!')
        .setFields({ name: 'Reason', value: `${LockReason}` })
        .setTimestamp()

        if (LockChannel.permissionsFor(guildId).has('SendMessages') === false) return interaction.reply({ 
            content: `${Emojis.Error_Emoji} Channel is already locked.`,
            ephemeral: true
         });

        LockChannel.permissionOverwrites.edit(guildId, { SendMessages: false }).then(() => {
            interaction.reply({ 
                content: `${Emojis.Success_Emoji} Channel has been locked.`,
                ephemeral: true
            });
            LockChannel.send({ embeds: [LockedEmbed] });
        });
    },
};