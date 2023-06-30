const { ChannelType } = require("discord.js");

/**
 * Gets a channel name instead of just showing the number type.
 */
function getChannelName(channel) {
    let channelName;

    switch (channel.type) {
        case ChannelType.GuildText:
            channelName = 'Text';
            break;
        case ChannelType.GuildVoice:
            channelName = 'Voice';
            break;
        case ChannelType.GuildCategory:
            channelName = 'Category';
            break;
        case ChannelType.GuildAnnouncement:
            channelName = 'Announcement';
            break;
        case ChannelType.GuildStageVoice:
            channelName = 'Stage';
            break;
        case ChannelType.GuildForum:
            channelName = 'Forum';
            break;
        case ChannelType.PublicThread:
        case ChannelType.PrivateThread:
        case ChannelType.AnnouncementThread:
            channelName = 'Thread';
            break;
        default:
            channelName = 'Unknown Channel';
            break;
    };
    return channelName;
};

module.exports = { getChannelName };