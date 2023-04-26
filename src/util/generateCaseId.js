const randomstring = require('randomstring');

/**
 * Creates a random case id.
 * @returns {string}
 */
function createCaseId() {
    const id = randomstring.generate({ length: 18, charset: 'numeric' });
    return id;
};

module.exports = { createCaseId };