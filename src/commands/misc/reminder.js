const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, codeBlock, userMention, inlineCode } = require('discord.js');
const { Colours } = require('../../config.json');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('Set a reminder.')
    .setDMPermission(false)
    .addStringOption(option => option.setName('message').setDescription('Reminder message.').setRequired(true))
    .addStringOption(option => option.setName('time').setDescription('Time until you are reminded.').setRequired(true))
    .addStringOption(option => option.setName('where').setDescription('Where you would like to be reminded.').setRequired(true).setChoices({ name: 'Channel', value: 'remind-channel' }, { name: 'Direct Message', value: 'dm-channel' })),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options, user, channel, createdTimestamp } = interaction;

        const ReminderMessage = options.getString('message');
        const ReminderTime = options.getString('time');
        const WhereToRemind = options.getString('where');

        const ReminderEmbed = new EmbedBuilder()
        .setColor(Colours.Default_Colour)
        .setTitle('Reminder')
        .setDescription(`Reminder scheduled for ${inlineCode(ms(ms(ReminderTime), { long: true }))} <t:${parseInt(createdTimestamp / 1000)}:R>\n\nReminder:\n${codeBlock(ReminderMessage)}`)

        switch (WhereToRemind) {
            case 'remind-channel':
                interaction.reply({ content: `Reminder has been set.`, ephemeral: true });
                setTimeout(() => { channel.send({ content: `${userMention(user.id)}`, embeds: [ReminderEmbed] }) }, ms(ReminderTime));
                break;
            case 'dm-channel':
                interaction.reply({ content: 'Reminder has been set (If you do not have DMs enabled.. you will not get anything).', ephemeral: true });
                setTimeout(() => { 
                    user.send({ embeds: [ReminderEmbed] }).catch(() => {
                        channel.send({ content: `${userMention(user.id)}, I tried to send you your reminder but you had your DMs off.` });
                    });
                }, ms(ReminderTime));
                break;
        };
    },
};
