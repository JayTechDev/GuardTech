// Welcomes new members to the server.

const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, userMention, roleMention } = require('discord.js');
const { Colours } = require('../../config.json');

module.exports = (client) => {
    client.on(Events.GuildMemberAdd, async (member) => {
        if (member.user.bot) return;

        const WelcomeEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setTitle('👋 Welcome to JayCord!')
        .setDescription(`Welcome ${userMention(member.user.id)}, make sure to say hi to our welcomers and have a good stay!`)

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Information').setStyle(ButtonStyle.Link).setURL('https://ptb.discord.com/channels/929378716902117468/929387535434674207'),
            new ButtonBuilder().setLabel('Introductions').setStyle(ButtonStyle.Link).setURL('https://ptb.discord.com/channels/929378716902117468/1094064060233945240')
        )
        
        await member.guild.channels.cache.get('929378716902117471').send({
            content: `${userMention(member.user.id)} | ${roleMention('959451229501677649')}`,
            embeds: [WelcomeEmbed],
            components: [Buttons]
        });
    });
};