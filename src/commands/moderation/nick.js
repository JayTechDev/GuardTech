const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Change or reset a member\'s nickname.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to change.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('nickname')
            .setDescription('New nickname.')
            .setMaxLength(32)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const TargetUser = options.getUser('target') || user;
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const Nickname = options.getString('nickname');

        if (!TargetMember.moderatable) return interaction.reply({ 
            content: `${Emojis.Error_Emoji} Unable to perform action.`
        });

        if (!Nickname) {
            if (!TargetMember.nickname) {
                return interaction.reply({ content: `${Error_Emoji} User has no nickname set.` });
            } else {
                await TargetMember.setNickname('');
                return interaction.reply({ content: `${Success_Emoji} Nickname has been reset.` });
            };
        } else {
            await TargetMember.setNickname(Nickname);
            return interaction.reply({ 
                content: `${Emojis.Success_Emoji} Nickname has been set to **${Nickname}**` 
            });
        };
    },
};