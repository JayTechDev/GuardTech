const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode, userMention } = require('discord.js');
const { Emojis, Links, PunishmentTypes, IDs } = require('../../config.json');
const wait = require('node:timers/promises').setTimeout;
const { createCaseId } = require('../../util/generateCaseId');
const database = require('../../database/schemas/PunishmentSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption(option => option
            .setName('target')
            .setDescription('User to ban.')
            .setRequired(true)
    )
    .addBooleanOption(option => option
            .setName('appeal')
            .setDescription('Whether or not the user can appeal this ban.')
    )
    .addStringOption(option => option
            .setName('reason')
            .setDescription('The ban reason.')
            .setMaxLength(1000)
            .setMinLength(1)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, guildId, options, user, createdTimestamp } = interaction;

        const TargetUser = options.getUser('target');
        const TargetMember = await guild.members.fetch(TargetUser.id);
        const Appealable = options.getBoolean('appeal');
        const BanReason = options.getString('reason') || 'No reason provided.';
        const BanDate = new Date(createdTimestamp).toDateString();
        const LogChannel = guild.channels.cache.get(IDs.ModerationLogs);
        const CaseId = createCaseId();

        const CannotDoActionEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Unable to perform action.`)
        if (!TargetMember.bannable) return interaction.reply({
            embeds: [CannotDoActionEmbed]
        });

        interaction.deferReply();
        
        const DirectMessageEmbed = new EmbedBuilder().setColor('Grey').setDescription(`You have received a ban in **${guild.name}**`)

        if (Appealable) {
            DirectMessageEmbed
            .setFields(
                { name: 'Reason', value: `${inlineCode(BanReason)}` },
                { name: 'Appeal', value: `${Links.Appeal_Link}` }
            )
    
            await TargetUser.send({
                embeds: [DirectMessageEmbed]
            }).catch(console.error);
        } else {
            DirectMessageEmbed
            .setFields(
                { name: 'Reason', value: `${inlineCode(BanReason)}` },
            )
    
            await TargetUser.send({
                embeds: [DirectMessageEmbed]
            }).catch(console.error);
        }
        
        await TargetMember.ban({ deleteMessageSeconds: 86400, reason: BanReason }).then(async () => {
             const ban = await database.create({
                Type: PunishmentTypes.Ban,
                CaseID: CaseId,
                GuildID: guildId,
                UserID: TargetUser.id,
                UserTag: TargetUser.username,
                Content: [
                    {
                        Moderator: user.username,
                        PunishmentDate: BanDate,
                        Reason: BanReason,
                    }
                ],
            });

            ban.save();
        });

        await wait(1000);
        const BanSuccessEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Success_Emoji} ${userMention(TargetUser.id)} has been banned | ${inlineCode(CaseId)}`)
        interaction.editReply({ 
            embeds: [BanSuccessEmbed]
        });

        const LogEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` })
        .setDescription(`**Member**: ${userMention(TargetUser.id)} | \`${TargetUser.id}\`\n**Type**: Ban\n**Reason**: ${BanReason}`)
        .setFooter({ text: `Punishment ID: ${CaseId}` })
        .setTimestamp()

        LogChannel.send({ embeds: [LogEmbed] });
    },
};