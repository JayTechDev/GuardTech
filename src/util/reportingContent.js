const { EmbedBuilder, ThreadAutoArchiveDuration, roleMention } = require('discord.js');

/**
 * Report a user.
 */
function reportUser({ guild, reporter, user, reason }) {
    const fetchedUser = guild.members.cache.get(user.id);

    const ReportedUserEmbed = new EmbedBuilder()
    .setColor('Red')
    .setAuthor({ name: `${reporter.username} (${reporter.id}) has reported a user.`, iconURL: `${reporter.displayAvatarURL()}` })
    .setDescription([
        `- Reported User: ${fetchedUser.user.username} (${fetchedUser.id})`,
        `- User Link: [link to the user](https://discord.com/users/${fetchedUser.id}).`,
    ].join('\n'))
    .addFields({ name: 'Reason', value: `${reason}` })

    fetchedUser.guild.channels.cache.get('1169780287241211934').threads.create({
        name: `User Report - ${reporter.username} (${reporter.id})`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
        message: {
            content: roleMention('929382693916008478'),
            embeds: [ReportedUserEmbed]
        },
    });
};

/**
 * Report a message.
 */
async function reportMessage({ id, reporter, channel, reason }) {
    const fetchedMessage = await channel.messages.fetch(id);
    
    const ReportedMessageEmbed = new EmbedBuilder()
    .setColor('Red')
    .setAuthor({ name: `${reporter.username} (${reporter.id}) has reported a message.`, iconURL: `${reporter.displayAvatarURL()}` })
    .setDescription([
        `- Original Author: ${fetchedMessage.author.username} (${fetchedMessage.author.id})`,
        `- Message: [link to message](${fetchedMessage.url}).`,
        `- Message Content: ${fetchedMessage.content || 'No content, most likely an image on its own.'}`,
    ].join('\n'))
    .addFields({ name: 'Reason', value: `${reason}` })

    if (fetchedMessage.attachments.size > 0) ReportedMessageEmbed.addFields({ name: 'Attachment', value: `${fetchedMessage.attachments.first().url}` })

    fetchedMessage.guild.channels.cache.get('1169780287241211934').threads.create({
        name: `Message Report - ${reporter.username} (${reporter.id})`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
        message: {
            content: roleMention('1113045236088852552'),
            embeds: [ReportedMessageEmbed]
        },
    });
};

module.exports = { reportUser, reportMessage };