let express = require('express');

const UsersModel = require("../models/users_model");

module.exports = function(mongoose) {
    const router = express.Router();

    router.post("/register", (req, res) => {
        new UsersModel({
            full_name: "Fabian",
            email: "fabian.enos@gmail.com",
            password: "123",
            salt: "salt",
            alg: "SHA-256",
        }).save((err, user) => {
            if(err) {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                }).end();
            } else {
                res.status(200).json({
                    success: true,
                    user: user,
                });
            }
        });
    });

    return router;
}