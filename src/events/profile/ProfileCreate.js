const { ModalSubmitInteraction, EmbedBuilder, inlineCode } = require('discord.js');
const profileDB = require('../../database/schemas/ProfileSchema.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction, client) {
        if (interaction.isModalSubmit() && interaction.customId == 'profile-modal') {
            const { guildId, user } = interaction;

            const BioField = interaction.fields.getTextInputValue('profile-bio');
            const AgeField = interaction.fields.getTextInputValue('profile-age');
            const BirthdayField = interaction.fields.getTextInputValue('profile-birthday');
            const GenderField = interaction.fields.getTextInputValue('profile-gender');
            const LocationField = interaction.fields.getTextInputValue('profile-location');
    
            const profile = await profileDB.create({
                GuildID: guildId,
                User: user.id,
                Content: [
                    {
                        Bio: BioField,
                        Age: AgeField,
                        Birthday: BirthdayField,
                        Gender: GenderField,
                        Location: LocationField,
                    }  
                ],
            });
    
            profile.save();
    
            const ProfileMadeEmbed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`Your profile has been created, use ${inlineCode('/profile view')} to view it.`)
            .setFooter({ text: 'TO MAKE CHANGES NOTIFY jay.ts#1337' })
    
            interaction.reply({
                embeds: [ProfileMadeEmbed],
            });
        };
    },
};