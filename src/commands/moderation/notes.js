const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
const { Emojis, Colours } = require('../../config.json');
const randomstring = require('randomstring');
const database = require('../../database/schemas/NoteSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('notes')
    .setDescription('User notes.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addSubcommand(subcmd => subcmd
            .setName('get')
            .setDescription('Get notes for a user.')
            .addUserOption(option => option
                .setName('target')
                .setDescription('User to show notes for.')  
        )
    )
    .addSubcommand(subcmd => subcmd
            .setName('add')
            .setDescription('Add a note to a user.')
            .addUserOption(option => option
                    .setName('target')
                    .setDescription('User to add the note to.')
                    .setRequired(true)    
            )
            .addStringOption(option => option
                    .setName('text')
                    .setDescription('Note text.')
                    .setMaxLength(1000)
                    .setMinLength(1)
                    .setRequired(true)  
            )
    )
    .addSubcommand(subcmd => subcmd
            .setName('edit')
            .setDescription('Edit a user note.')
            .addStringOption(option => option
                    .setName('id')
                    .setDescription('Note to edit.')
                    .setRequired(true)    
            )
            .addStringOption(option => option
                    .setName('text')
                    .setDescription('Note text.')
                    .setMaxLength(1000)
                    .setMinLength(1)
                    .setRequired(true)  
            )
    )
    .addSubcommand(subcmd => subcmd
            .setName('delete')
            .setDescription('Delete a note.')
            .addStringOption(option => option
                    .setName('id')
                    .setDescription('Note id.')
                    .setRequired(true)  
            )
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guildId, options, user } = interaction;

        switch (options.getSubcommand()) {
            case 'get':
                const RequestedUser = options.getUser('target') || user;

                const data = await database.find({ GuildID: guildId, UserID: user.id });
                if(!data) return interaction.reply({
                    content: `${Emojis.Error_Emoji} No notes found for **${RequestedUser.tag}**`
                });

                const fields = [];
                data.forEach(note => fields.push({ name: `ID: ${note.NoteID}`, value: `${note.Text}` }));

                const NotesEmbed = new EmbedBuilder()
                .setColor(Colours.Default_Colour)
                .setTitle(`Notes for ${RequestedUser.tag}`)
                .setFields(fields)

                interaction.reply({
                    embeds: [NotesEmbed]
                });
                break;
            case 'add':
                const Target = options.getUser('target');
                const NoteText = options.getString('text');

                const NoteId = randomstring.generate({ length: 5, charset: 'numeric' });

                const note = await database.create({
                    NoteID: NoteId,
                    GuildID: guildId,
                    UserID: Target.id,
                    UserTag: Target.tag,
                    Text: NoteText
                });
        
                note.save();

                interaction.reply({
                    content: `${Emojis.Success_Emoji} Note has been added to **${Target.tag}**`
                });
                break;
            case 'edit':
                const Id = options.getString('id');
                const NewText = options.getString('text');

                const NoteToEdit = await database.findOne({ NoteID: Id, GuildID: guildId, UserID: user.id });
                if (!NoteToEdit) return interaction.reply({
                    content: `${Emojis.Error_Emoji} No notes found for **${RequestedUser.tag}**`
                });
                
                await database.findOneAndUpdate({ NoteID: Id, GuildID: guildId, UserID: user.id }, { $set: { Text: NewText } }).then(() => {
                    interaction.reply({
                        content: `${Emojis.Success_Emoji} Note edited.`
                    });
                });

                break;
            case 'delete':
                const Note = options.getString('id');

                const foundNote = await database.findOne({ NoteID: Note, GuildID: guildId, UserID: user.id });
                if (!foundNote) return interaction.reply({
                    content: `${Emojis.Error_Emoji} No note found with ID ${inlineCode(Note)}`
                });

                database.deleteOne({ GuildID: guildId, NoteID: Note }).then(() => {
                    interaction.reply({ 
                        content: `${Emojis.Success_Emoji} Note has been deleted.`
                    });
                });
                break;
        };
    },
};