const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, PermissionFlagsBits, ActivityType } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Change the bot\'s status.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addStringOption(option => option.setName('type').setDescription('The type of the activity.').setRequired(true).addChoices({ name: 'Custom', value: 'custom' }, { name: 'Watching', value: 'watching' }, { name: 'Listening', value: 'listening' }, { name: 'Playing', value: 'playing' }))
    .addStringOption(option => option.setName('name').setDescription('The name to use.'))
    .addStringOption(option => option.setName('state').setDescription('The status text (ONLY IF CUSTOM IS USED).')),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;
        
        const StatusName = options.getString('name');
        const StatusType = options.getString('type');
        let ChosenType = '';

        switch (StatusType) {
            case 'watching':
                ChosenType = ActivityType.Watching
                break;
            case 'listening':
                ChosenType = ActivityType.Listening
                break;
            case 'playing':
                ChosenType = ActivityType.Playing
                break;
        };

        if (StatusType == 'custom') {
            const StateText = options.getString('state');
            client.user.setActivity({ type: ActivityType.Custom, name: 'custom', state: StateText });
        } else {
            client.user.setActivity({ name: `${StatusName}`, type: ChosenType });
        };

        const StatusChangedEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Emojis.Success_Emoji} Status has been changed.`)
        interaction.reply({ embeds: [StatusChangedEmbed] });
    },
};
