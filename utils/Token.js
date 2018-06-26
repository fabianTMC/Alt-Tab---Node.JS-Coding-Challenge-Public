const jwt = require('jsonwebtoken');
const config = require('../config');

function IssueToken(payload) {
    var token = jwt.sign(payload, config.jwt.secret);

    return token;
}

module.exports = {
    IssueToken: IssueToken,
};