const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention } = require('discord.js');
const { Emojis } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('partner')
    .setDescription('Partner someone with JayCord.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('The user to partner.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('invite')
            .setDescription('The invite link.')
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('name')
            .setDescription('The server name.')
            .setRequired(true)
            .setMaxLength(1000)
            .setMinLength(1)
            .setRequired(true)
    )
    .addStringOption(option => option
            .setName('description')
            .setDescription('The server description.')
            .setRequired(true)
            .setMaxLength(1000)
            .setMinLength(1)
            .setRequired(true)
    )
    .addNumberOption(option => option
            .setName('members')
            .setDescription('The amount of members.')
            .setRequired(true)
            .setMinValue(50)
    )
	.addStringOption(option => option
            .setName('notes')
            .setDescription('Any extra notes.')
            .setRequired(false)
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const ServerName = options.getString('name');
        const ServerDescription = options.getString('description');
    	const ServerNotes = options.getString('notes') || 'None';
        const InviteLink = options.getString('invite');
        const MemberCount = options.getNumber('members');

        const PartnerChannel = guild.channels.cache.get('1084907567471411330');

        const PartnerEmbed = new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`:globe_with_meridians: ${ServerName}`)
        .setURL(`${InviteLink}`)
        .setDescription(`${ServerDescription}`)
        .setThumbnail(`${TargetUser.displayAvatarURL()}`)
        .setFields(
            { name: 'Members', value: `${MemberCount}`, inline: true },
            { name: 'Partner', value: `${userMention(TargetUser.id)}`, inline: true },
    	    { name: 'Notes', value: `${ServerNotes}`, inline: true },
        )
        .setTimestamp()

        PartnerChannel.send({ embeds: [PartnerEmbed] }).then(() => {
            TargetMember.roles.add('1077662462263963678');

            const PartnerSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been partnered with JayCord successfully.`)
            interaction.reply({
                embeds: [PartnerSuccessEmbed]
            });
        });
    },
};
