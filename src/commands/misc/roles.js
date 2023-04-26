const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Emojis, Colours } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('List all server roles.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addSubcommand(subcmd => subcmd
            .setName('list')
            .setDescription('List all server roles.')
    )
    .addSubcommand(subcmd => subcmd
            .setName('add')
            .setDescription('Add a user to a role.')
            .addUserOption(option => option
                    .setName('target')
                    .setDescription('User to give the role to.')
                    .setRequired(true)    
            )
            .addRoleOption(option => option
                    .setName('role')
                    .setDescription('Role to give.')
                    .setRequired(true)  
            )
    )
    .addSubcommand(subcmd => subcmd
            .setName('remove')
            .setDescription('Remove a user from a role.')
            .addUserOption(option => option
                    .setName('target')
                    .setDescription('User to remove a role from.')
                    .setRequired(true)    
            )
            .addRoleOption(option => option
                    .setName('role')
                    .setDescription('Role to remove.')
                    .setRequired(true)  
            )
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        switch (options.getSubcommand()) {
            case 'list':
                const ServerRoles = (await guild.roles.fetch()).sort((a, b) => b.position - a.position).map((r) => r);

                const Roles = [];
                ServerRoles.forEach(role => { Roles.push(`<@&${role.id}>`) });
        
                const RolesEmbed = new EmbedBuilder()
                .setColor(Colours.Default_Colour)
                .setDescription(Roles.join('\n'))
        
                interaction.reply({
                    embeds: [RolesEmbed]
                });
                break;
            case 'add':
                const AddTargetUser = options.getUser('target');
                const AddTargetMember = await guild.members.fetch(AddTargetUser.id);
                const RoleToAdd = options.getRole('role');

                if (!AddTargetMember.manageable || AddTargetMember.roles.cache.has(RoleToAdd.id)) return interaction.reply({
                    content: `${Emojis.Error_Emoji} Unable to perform action.`
                });

                await AddTargetMember.roles.add(RoleToAdd);
                interaction.reply({
                    content: `${Emojis.Success_Emoji} **${AddTargetUser.tag}** has been given the role ${RoleToAdd}`,
                    allowedMentions: { parse: [] }
                });
                break;
            case 'remove':
                const RemoveTargetUser = options.getUser('target');
                const RemoveTargetMember = await guild.members.fetch(RemoveTargetUser.id);
                const RoleToRemove = options.getRole('role');

                if (!RemoveTargetMember.manageable || !RemoveTargetMember.roles.cache.has(RoleToRemove.id)) return interaction.reply({
                    content: `${Emojis.Error_Emoji} Unable to perform action.`
                });

                await RemoveTargetMember.roles.remove(RoleToRemove);
                interaction.reply({
                    content: `${Emojis.Success_Emoji} **${RemoveTargetUser.tag}** has been removed from the role ${RoleToRemove}`,
                    allowedMentions: { parse: [] }
                });
                break;
        };
    },
};