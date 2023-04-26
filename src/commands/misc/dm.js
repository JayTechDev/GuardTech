const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, inlineCode } = require('discord.js');
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
     */
    async execute(interaction, client) {
        const { guild, options, user } = interaction;

        const TargetUser = options.getUser('target');
        const Message = options.getString('message');

        const LogChannel = guild.channels.cache.get('946156222292299807');

        TargetUser.send({
            content: `**${user.tag}** has sent you a message!\n\nMessage: ${inlineCode(Message)}`
        }).catch(() => {
            return interaction.reply({
                content: `**${TargetUser.tag}** has their dms off :(`,
            });
        });

        interaction.reply({
            content: `${Emojis.Success_Emoji} Sent a message to **${TargetUser.tag}**`,
            ephemeral: true
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('White')
        .setTitle('DM Message Sent')
        .setDescription(`**User**: <@${TargetUser.id}> | \`${TargetUser.id}\`\n**By**: <@${user.id}> | \`${user.id}\``)
        .setFields(
            { name: 'Message', value: `${inlineCode(Message)}` },
        )

        LogChannel.send({
            embeds: [LogEmbed]
        });
    },
};
