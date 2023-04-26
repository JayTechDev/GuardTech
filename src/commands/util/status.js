const { ChatInputCommandInteraction, SlashCommandBuilder, Client, PermissionFlagsBits, ActivityType } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Change the bot\'s status.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addStringOption(option => option
            .setName('text')
            .setDescription('Status text.')
            .setRequired(true)
            .setMaxLength(32)
            .setMinLength(1)
    )
    .addStringOption(option => option
            .setName('type')
            .setDescription('Activity type.')
            .setRequired(true)
            .addChoices(
                { name: 'Watching', value: 'watching' },
                { name: 'Listening', value: 'listening' },
                { name: 'Playing', value: 'playing' }
            )
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;
        
        const StatusText = options.getString('text');
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

        client.user.setActivity({ name: `${StatusText}`, type: ChosenType });

        interaction.reply({ 
            content: `${Emojis.Success_Emoji} Status changed to **${StatusText}** with type **${ChosenType}**`
        });
    },
};
