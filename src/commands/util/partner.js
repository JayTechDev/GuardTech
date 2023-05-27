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
	const ServerNotes = options.getString('notes');
        const InviteLink = options.getString('invite');
        const MemberCount = options.getNumber('members');

        const PartnerChannel = guild.channels.cache.get('1084907567471411330');

        const PartnerEmbed = new EmbedBuilder()
        .setColor('Aqua')
        .setAuthor({ name: 'Jay\'s Assistant', iconURL: 'https://cdn.discordapp.com/avatars/1091308443480096838/f269f573ab58ce2c7a6b63be4d72c9cf.png?size=512', url: 'https://discord.gg/jaycord' })
        .setTitle(`:globe_with_meridians: ${ServerName}`)
        .setURL(`${InviteLink}`)
        .setDescription(`${ServerDescription}`)
        .setThumbnail(`${TargetUser.displayAvatarURL()}`)
        .setFields(
            { name: '• Members', value: `${MemberCount}`, inline: false },
            { name: '• Partner', value: `${userMention(TargetUser.id)}`, inline: false },
	    { name: '• Notes', value: `${ServerNotes}`, inline: false },
        )
        .setTimestamp()

        PartnerChannel.send({ embeds: [PartnerEmbed] }).then(() => {
            TargetMember.roles.add('1092047589484007474');
            interaction.reply({
                content: `${Emojis.Success_Emoji} **${TargetUser.tag}** has been partnered with JayCord successfully.`
            });
        });
    },
};
