const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');

class Assistant extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildMembers,
            ],
            presence: {
                status: 'dnd',
                activities: [ { name: 'JayCord', type: ActivityType.Watching } ]  
            },
            allowedMentions: { parse: ['users', 'roles'] },
        });

        this.commands = new Collection();
    };
};

module.exports = { Assistant };