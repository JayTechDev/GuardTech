const { Client } = require("discord.js");

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        console.log('[Bot Status]: Online');
    },
};