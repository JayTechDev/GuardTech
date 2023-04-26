const { Schema, model } = require('mongoose');

module.exports = model(
    'BlacklistDB',
    new Schema({
        CaseID: String,
        GuildID: String,
        UserID: String,
        UserTag: String,
        Reason: String
    })
)
