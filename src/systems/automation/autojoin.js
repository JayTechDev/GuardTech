// Automatically joins threads.

const { Events } = require('discord.js');

module.exports = (client) => {
    client.on(Events.ThreadCreate, (thread) => { thread.join() });
};