'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const config = require("./config");

mongoose.connect(`mongodb://${config.mongoose.host}/${config.mongoose.database}`);

const UsersRouter = require("./routes/users")(mongoose);

let app = express();

app.use(bodyParser.json());

app.use("/api", UsersRouter);

app.use(express.static('app_client'));
app.use(express.static('public'));

app.use(function (err, req, res, next) {
    if(err.name) {
        if(err.name === 'UnauthorizedError' || err.name === 'RevokedTokenError') {
            res.status(401).json({
                message: "Unauthorized"
            }).end();
        } else {
            console.log(err);

            res.status(500).json({
                message: "Internal Server Error",
            }).end();
        }
    } else {
        console.log(err);

        res.status(500).json({
            message: "Internal Server Error",
        }).end();
    }
});

app.listen(config.PORT, () => console.log(`App listening on port ${config.PORT}`));

module.exports = app;
