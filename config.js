module.exports = {
    PORT: process.env.PORT || 3000,
    mongoose: {
        host: "localhost",
        database: "upstack",
        SALT_WORK_FACTOR: 10,
    },
}