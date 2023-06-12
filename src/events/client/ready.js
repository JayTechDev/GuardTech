const { Client, EmbedBuilder, userMention } = require("discord.js");
const { Colours } = require('../../config.json');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        console.log('[Bot Status]: Online');

        client.channels.fetch('929378716902117471').then(channel => {
            const OnlineEmbed = new EmbedBuilder()
            .setColor(Colours.Default_Colour)
            .setDescription(`${userMention(client.user.id)} is now online, if something breaks blame Jay or Celyrian.`)

            channel.send({ embeds: [OnlineEmbed] })
        });
    },
};