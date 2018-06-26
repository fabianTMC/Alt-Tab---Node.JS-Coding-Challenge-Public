let express = require('express');

const UsersModel = require("../models/users_model");
const validator = require('validator');

const Token = require("../utils/Token");

module.exports = function(mongoose) {
    const router = express.Router();

    router.post("/register", (req, res) => {
        if(req.body) {
            if(req.body.email && validator.isEmail(req.body.email) && req.body.password && !validator.isEmpty(req.body.password) && req.body.name && !validator.isEmpty(req.body.name)) {
                new UsersModel({
                    full_name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                }).save((err, user) => {
                    if(err) {
                        if(err.code) {
                            switch(err.code) {
                                case 11000: {
                                    return res.status(400).json({
                                        success: false,
                                        message: "Email already registered"
                                    }).end();
                                    break;
                                }
                            }
                        }

                        console.log(err);

                        return res.status(500).json({
                            success: false,
                            message: "Internal server error",
                        }).end();
                    } else {
                        return res.status(201).json({
                            success: true,
                            token: Token.IssueToken({uuid: user.uuid}),
                        }).end();
                    }
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid body",
                }).end();
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid body",
            }).end();
        }
    });

    return router;
}