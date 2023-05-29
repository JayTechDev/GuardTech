const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, inlineCode, userMention } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('DM a user with a message.')
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('The user to dm.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('message')
            .setDescription('What do you want to say?')
            .setRequired(true)
            .setMaxLength(2000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild, options, user } = interaction;

        const TargetUser = options.getUser('target');
        const Message = options.getString('message');

        const LogChannel = guild.channels.cache.get('946156222292299807');

        if (TargetUser.id === client.user.id || TargetUser.bot) return;

        TargetUser.send({
            content: `**${user.tag}** has sent you a message!\n\nMessage: ${inlineCode(Message)}`
        }).catch(() => {
            return interaction.reply({
                content: 'The user you specified has their dms off :(',
            });
        });

        interaction.reply({
            content: `${Emojis.Success_Emoji} Sent a message to **${TargetUser.tag}**`,
            ephemeral: true
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('White')
        .setTitle('DM Message Sent')
        .setDescription(`**User**: ${userMention(TargetUser.id)} | ${inlineCode(TargetUser.id)}\n**By**: ${userMention(user.id)} | ${inlineCode(user.id)}`)
        .setFields(
            { name: 'Message', value: `${inlineCode(Message)}` },
        )

        LogChannel.send({
            embeds: [LogEmbed]
        });
    },
};
