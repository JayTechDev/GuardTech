const { Schema, model } = require('mongoose');

module.exports = model(
    'NoteDB',
    new Schema({
        NoteID: String,
        GuildID: String,
        UserID: String,
        UserTag: String,
        Text: String
    })
)
