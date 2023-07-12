const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, ChannelType, channelMention } = require('discord.js');
const { Emojis } = require('../../config.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption(option => option.setName('message').setDescription('What do you want the bot to say?').setRequired(true).setMaxLength(2000).setMinLength(1))
    .addStringOption(option => option.setName('reference').setDescription('The id of the message to reply to, NOT the message link.'))
    .addChannelOption(option => option.setName('channel').setDescription('Where to send the message.').addChannelTypes(ChannelType.GuildText)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { channel, options } = interaction;

        const Message = options.getString('message');
        const Reference = options.getString('reference');
        const Channel = options.getChannel('channel') || channel;

        await interaction.deferReply({ ephemeral: true });
        
        if (Reference) {
            await Channel.messages.fetch(Reference).then(message => { message.reply({ content: `${Message}`, allowedMentions: { repliedUser: true } }) });
        } else {
            Channel.send({ content: `${Message}`, allowedMentions: { parse: ['users'] } });
        };

        await interaction.editReply({ content: 'Message has been sent.' });
    },
};
