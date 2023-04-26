const { Schema, model } = require('mongoose');

module.exports = model(
    'BlockDB',
    new Schema({
        GuildID: String,
        UserID: String,
        UserTag: String,
        Content: Array
    })
)
