const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, inlineCode } = require('discord.js');
const { Emojis, Colours } = require('../../config.json');
const database = require('../../database/schemas/ProfileSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('User profiles.')
    .setDMPermission(false)
    .addSubcommand(subcmd => subcmd
            .setName('create')
            .setDescription('Create a profile if you don\'t have one already.')
    )
    .addSubcommand(subcmd => subcmd
            .setName('delete')
            .setDescription('Delete your profile.')
    )
    .addSubcommand(subcmd => subcmd
            .setName('view')
            .setDescription('View a user\'s profile.')
            .addUserOption(option => option
                    .setName('target')
                    .setDescription('Target to get a profile of.')
            )
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guildId, options, user } = interaction;

        switch (options.getSubcommand()) {
            case 'create':
                const data = await database.findOne({ GuildID: guildId, User: user.id });

                const AlreadyHaveProfileEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} You already have a profile, use ${inlineCode('/profile view')} to view it.`)
                if (data) {
                    return interaction.reply({
                        embeds: [AlreadyHaveProfileEmbed]
                    });
                };

                const ProfileModal = new ModalBuilder()
                .setCustomId('profile-modal')
                .setTitle('Create Profile')
                
                const BioInput = new TextInputBuilder()
                .setCustomId('profile-bio')
                .setLabel('Bio')
                .setPlaceholder('I like turtles etc..')
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(2000)
                .setMinLength(1)
                .setRequired(true)

                const AgeInput = new TextInputBuilder()
                .setCustomId('profile-age')
                .setLabel('Age')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(100)
                .setMinLength(2)
                .setRequired(true)

                const BirthdayInput = new TextInputBuilder()
                .setCustomId('profile-birthday')
                .setLabel('Birthday')
                .setPlaceholder('2/6/2007')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(13)
                .setMinLength(8)
                .setRequired(true)
                
                const GenderInput = new TextInputBuilder()
                .setCustomId('profile-gender')
                .setLabel('Gender')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(10)
                .setMinLength(4)
                .setRequired(true)
                
                const LocationInput = new TextInputBuilder()
                .setCustomId('profile-location')
                .setLabel('Location')
                .setPlaceholder('England')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(100)
                .setMinLength(1)
                .setRequired(true)

                const row1 = new ActionRowBuilder().addComponents(BioInput);
                const row2 = new ActionRowBuilder().addComponents(AgeInput);
                const row3 = new ActionRowBuilder().addComponents(BirthdayInput);
                const row4 = new ActionRowBuilder().addComponents(GenderInput);
                const row5 = new ActionRowBuilder().addComponents(LocationInput);
                ProfileModal.addComponents(row1, row2, row3, row4, row5);

                interaction.showModal(ProfileModal);
                break;
            case 'view':
                const Target = options.getUser('target') || user;

                const UserBanner = (await client.users.fetch(Target, { force: true })).bannerURL({ size: 2048 }) || null;
                const UserColour = (await client.users.fetch(Target, { force: true })).hexAccentColor;

                const profile = await database.findOne({ GuildID: guildId, User: Target.id });

                const NoProfileEmbed = new EmbedBuilder().setColor('Red').setDescription(`${Emojis.Error_Emoji} Could not find a profile for this user, do they have one?`)
                if (!profile) {
                    return interaction.reply({
                        embeds: [NoProfileEmbed]
                    });
                };

                const ProfileEmbed = new EmbedBuilder()
                .setColor(UserColour || Colours.Default_Colour)
                .setAuthor({ name: `${Target.username}`, iconURL: `${Target.displayAvatarURL()}` })
                .setDescription(`${profile.Content[0].Bio}`)
                .setThumbnail(`${Target.displayAvatarURL()}`)
                .setImage(UserBanner)
                .setFields(
                    {
                        name: 'Age',
                        value: `${profile.Content[0].Age}`
                    },
                    {
                        name: 'Birthday',
                        value: `${profile.Content[0].Birthday}`
                    },
                    {
                        name: 'Gender',
                        value: `${profile.Content[0].Gender}`
                    },
                    {
                        name: 'Location',
                        value: `${profile.Content[0].Location}`
                    }
                )

                await interaction.reply({
                    embeds: [ProfileEmbed]
                });
                break;
            case 'delete':
                const UserProfile = await database.findOne({ GuildID: guildId, User: user.id });

                const DeleteProfileEmbed = new EmbedBuilder()
                if (!UserProfile) {
                    return interaction.reply({
                        embeds: [DeleteProfileEmbed.setColor('Red').setDescription(`${Emojis.Error_Emoji} You do not have a profile to delete.`)]
                    });
                };

                database.deleteOne({ GuildID: guildId, User: user.id }).then(() => {
                    interaction.reply({
                        embeds: [DeleteProfileEmbed.setColor('Green').setDescription(`${Emojis.Success_Emoji} Your profile has been deleted.`)]
                    });
                });
                break;
        }
    },
};
