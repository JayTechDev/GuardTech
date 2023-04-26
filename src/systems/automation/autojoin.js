// Automatically joins threads.

const { Events } = require('discord.js');

module.exports = (client) => {
    client.on(Events.ThreadCreate, async (thread) => {
        thread.join();
    });
};