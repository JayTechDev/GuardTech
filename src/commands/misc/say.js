const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, ChannelType, channelMention } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption(option => option
            .setName('message')
            .setDescription('What do you want the bot to say?')
            .setRequired(true)
            .setMaxLength(2000)
            .setMinLength(1)
    )
    .addChannelOption(option => option
            .setName('channel')
            .setDescription('Where to send the message.')
            .addChannelTypes(ChannelType.GuildText)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { channel, options } = interaction;

        const Message = options.getString('message');
        const Channel = options.getChannel('channel') || channel;

        Channel.sendTyping();

        Channel.send({ content: `${Message}`, allowedMentions: { parse: ['users'] } }).then(() => {
            interaction.reply({
                content: `${Emojis.Success_Emoji} Message sent to ${channelMention(Channel.id)}`,
                ephemeral: true
            });
        });
    },
};
