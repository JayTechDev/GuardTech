const { ThreadChannel } = require('discord.js');

module.exports = {
    name: 'threadCreate',
    /**
     * @param {ThreadChannel} thread
     */
    async execute(thread) {
        await thread.join();
    },
};