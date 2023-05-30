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
            .setTitle('Online')
            .setDescription(`<:online:1100886580169822218> ${userMention(client.user.id)} is now online, if something breaks blame Jay.`)

            channel.send({ embeds: [OnlineEmbed] })
        });
    },
};