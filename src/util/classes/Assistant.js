const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { readdirSync } = require('fs');
const { connect } = require('mongoose');
require('dotenv/config');

class Assistant extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildMembers
            ],
            presence: {
                status: 'dnd',
                activities: [ { name: 'JayCord', type: ActivityType.Watching } ]  
            },
            allowedMentions: { parse: ['users', 'roles'] },
        });

        this.commands = new Collection();
    };

    startup(client) {
        console.clear();
        
        const HandlerFiles = readdirSync('./src/handlers/').filter(file => file.endsWith('.js'));
        for (const file of HandlerFiles) require(`../../handlers/${file}`)(client);

        client.handleCommands();
        client.handleEvents();
        client.login(process.env.BOT_TOKEN).then(() => { connect(process.env.DATABASE_URL).then(() => console.log('[Database Status]: Connected')) }).catch(console.error);
    };
};

module.exports = { Assistant };