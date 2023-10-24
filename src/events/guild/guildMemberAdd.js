const { GuildMember, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, userMention, roleMention } = require('discord.js');
const { Colours, IDs } = require('../../config.json');

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {GuildMember} member
     */
    async execute(member) {
        const { guild, user } = member;

        if (user.bot) return;

        const WelcomeEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setTitle(`👋 Welcome to ${guild.name}!`)
        .setDescription(`Welcome ${userMention(user.id)}, make sure to say hi to our welcomers and have a good stay!`)

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Information').setStyle(ButtonStyle.Link).setURL('https://ptb.discord.com/channels/929378716902117468/929387535434674207'),
            new ButtonBuilder().setLabel('Introductions').setStyle(ButtonStyle.Link).setURL('https://ptb.discord.com/channels/929378716902117468/1142841565182701588')
        )

        await guild.channels.cache.get(IDs.WelcomeChannel).send({ content: `${userMention(user.id)} | ${roleMention('959451229501677649')}`, embeds: [WelcomeEmbed], components: [Buttons] });
    },
};