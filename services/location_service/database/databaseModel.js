const mongo = require("mongodb").MongoClient;
const collectionName = "testCollection";
const dbName = "mydb";

const database = {
    getDb: async function getDb() {
        let dsn = "mongodb://localhost:27018/mydb";

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        try {
            const db = await client.db(dbName);
            const collection = await db.collection(collectionName);
            return {
                collection:  collection,
                client: client,
            };
        } catch(e) {
            return {
                errors: {
                    message: "sumting wong",
                }
            };
        }
    },
    findAll: async function findAll(){
        const client = await this.getDb(collectionName);
        const result = await client.collection.find().toArray();
        client.client.close();
        return result;
    }
    ,
    insertOne: async function insertOne(e){
        const client = await this.getDb(collectionName);
        const result = await client.collection.insertOne(e);
        client.client.close();
        return result;
    }
};

module.exports = database;