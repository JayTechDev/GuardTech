const randomstring = require('randomstring');

/**
 * Creates a random case id.
 * @returns {String}
 */
function createCaseId() {
    const id = randomstring.generate({ length: 18, charset: 'numeric' });
    return id;
};

module.exports = { createCaseId };