const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, ChannelType, userMention } = require('discord.js');
const { Emojis } = require('../../config.json');
const database = require('../../database/schemas/BlockSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('block')
    .setDescription('Block a user from speaking in a channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to block.')
            .setRequired(true)
    )
    .addChannelOption(option => option
            .setName('channel')
            .setDescription('Channel to block the user from.')
            .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The block reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, channel } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const BlockChannel = options.getChannel('channel') || channel;
        const BlockReason = options.getString('reason') || 'No reason provided.';

        const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Unable to perform action.`)
        if (!TargetMember.moderatable || await database.findOne({ GuildID: guildId, UserID: TargetUser.id })) return interaction.reply({
            embeds: [CannotDoActionEmbed]
        });

        BlockChannel.permissionOverwrites.edit(TargetUser.id, { SendMessages: false, CreatePublicThreads: false, CreatePrivateThreads: false }).then(async () => {
            const BlockSuccessEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been blocked | ${inlineCode(BlockReason)}`)
            interaction.reply({ 
                embeds: [BlockSuccessEmbed]
            });

            const block = await database.create({
                GuildID: guildId,
                UserID: TargetUser.id,
                UserTag: TargetUser.tag,
                Content: [
                    {
                        Channel: BlockChannel.id,
                        Reason: BlockReason
                    }
                ]
            });
    
            block.save();
        });
    },
};