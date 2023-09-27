const { Schema, model } = require('mongoose');

module.exports = model('CertifyDB', new Schema({ Link: String, Description: String, CertifiedOn: String }))