const { Schema, model } = require('mongoose');

module.exports = model(
    'ProfileDB',
    new Schema({
        GuildID: String,
        User: String,
        Content: Array
    })
)
