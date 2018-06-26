const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const config = require('../config');

const TokensModel = require("../models/tokens_model");

class RevokedTokenError extends Error {
    constructor(message) {
        super(message);

        this.name = "RevokedTokenError";
    }
}

function IssueToken(user) {
    return new Promise((resolve, reject) => {
        var token = jwt.sign({uuid: user}, config.jwt.secret);

        new TokensModel({
            user: user,
            token: token,
        }).save((err, tuple) => {
            if(err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

function RevokeToken(user, token) {
    return new Promise((resolve, reject) => {
        TokensModel.update({user: user, token: token}, {
            $set: {
                revoked: true
            }
        }, (err, token) => {
            if(err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

function checkIfRevoked(req, payload, done) {
    TokensModel.findOne({user: payload.uuid, token: req.token, revoked: false}, (err, token) => {
        if(err) {
            console.log(err);

            return done(err);
        } else {
            if(token) {
                return done(null);
            } else {
                return done(new RevokedTokenError("Revoked Token"));
            }
        }
    });
};  

function getToken(req) {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let token = req.headers.authorization.split(' ')[1];
        req.token = token;
        return token;
    } else if (req.query && req.query.token) {
        let token = req.query.token;
        req.token = token;
        return token;
    }

    return null;
}

module.exports = {
    IssueToken: IssueToken,
    ValidateToken: expressJWT({
        secret: config.jwt.secret, 
        isRevoked: checkIfRevoked,
        getToken: getToken
    }),
    RevokeToken: RevokeToken,
};