'use strict';

let express = require('express');
const mongoose = require('mongoose');

const config = require("./config");

mongoose.connect(`mongodb://${config.mongoose.host}/${config.mongoose.database}`);

const UsersRouter = require("./routes/users")(mongoose);

let app = express();

app.use("/api", UsersRouter);

app.use(express.static('app_client'));
app.use(express.static('public'));

app.listen(config.PORT, () => console.log(`App listening on port ${config.PORT}`));

module.exports = app;
