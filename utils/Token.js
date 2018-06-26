const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const config = require('../config');

function IssueToken(payload) {
    var token = jwt.sign(payload, config.jwt.secret);

    return token;
}

module.exports = {
    IssueToken: IssueToken,
    ValidateToken: expressJWT({secret: config.jwt.secret}),
};