const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Emojis } = require('../../config.json');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Sets a channel\'s slowmode.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false)
    .addStringOption(option => option
            .setName('duration')
            .setDescription('Slowmode duration.')
            .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { channel, options } = interaction;
        
        const SlowmodeDuration = options.getString('duration');
                
        let SplitDuration = SlowmodeDuration.split(' ');
        let Total = 0;
        let error = false;

        SplitDuration.forEach(e => {
            const magnitude = parseInt(e.slice(0, -1));
            const unit = e.charAt(e.length - 1);

            switch(unit) {
                case 'h':
                    Total += (magnitude * 60 * 60);
                    break;
                case 'm':
                    Total += (magnitude * 60);
                    break;
                case 's':
                    Total += magnitude;
                    break;
                default:
                    error = true;
            }
        });

        if(!error) {
            channel.setRateLimitPerUser(Total);
            await interaction.reply({
                content: `${Emojis.Success_Emoji} Slowmode set to **${ms(ms(SlowmodeDuration), { long: true })}**`
            });
        } else {
            await interaction.reply({
                content: `${Emojis.Error_Emoji} Unable to set slowmode.`
            });
        }
    },
};