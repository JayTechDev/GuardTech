const { Message, MessageType } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    /**
     * @param {Message} message
     */
    async execute(message) {
        const { guild } = message;
        const DisallowedPings = await guild.autoModerationRules.fetch('1127734149889937529').then(rule => rule.triggerMetadata.keywordFilter);

        if (message.type === MessageType.Reply) {
            if (message.mentions.users.some(user => DisallowedPings.includes(`<@${user.id}>`))) message.delete();
        };
    },
};