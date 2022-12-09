const mongo = require("mongodb").MongoClient;

const database = {

    getDb: async function getDb() {
        try {
            const client = await mongo.connect("mongodb://mongodb:27017/mydb", { useNewUrlParser: true,
            useUnifiedTopology: true, });
        return client;
        } catch(e) {
            return {
                errors: {
                    message: "sumting wong",
                }
            };
        }
    }
}

module.exports = database;