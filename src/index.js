const { Assistant } = require('./util/classes/Assistant');

const client = new Assistant();
client.startup(client);