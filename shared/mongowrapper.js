const  ObjectID = require('mongodb').ObjectId;
const mongo = require("mongodb").MongoClient;

/**
 * A class for creating MongoDB wrapper objects.
 */
class mongowrapper {
    /**
     * Creates a MongoDB wrapper object.
     * @param {Object} client - A MongoClient object.
     */
    constructor() {
      this.client;
      this.url = "mongodb://mongodb:27017/mydb"
    }

    async connectClient(){
      try {
        const client = await mongo.connect(this.url, { useNewUrlParser: true,
        useUnifiedTopology: true, });
        this.client = client;
        return client;
      } catch(e) {
            return {
                errors: {
                    message: "could not connect to mongo",
                }
            };
      }
    }


    /**
     * Gets a collection from MongoDB.
     * @param {string} dbName - The name of the database.
     * @param {string} collectionName - The name of the collection.
     * @returns {Object} - The collection.
     */
    async getCollection(dbName, collectionName) {
      const db = this.client.db(dbName);
      return db.collection(collectionName);
    }

    /**
     * Inserts a document into a collection.
     * @param {string} dbName - The name of the database.
     * @param {string} collectionName - The name of the collection.
     * @param {Object} document - The document to insert.
     * @returns {Object} - The result of the insert operation.
     */
    async insertOne(dbName, collectionName, document) {
      const collection = await this.getCollection(dbName, collectionName);
      return collection.insertOne(document);
    }

    /**
     * Inserts many documents into a collection.
     * @param {string} dbName - The name of the database.
     * @param {string} collectionName - The name of the collection.
     * @param {Array} arrayOfDocuments - array with objects
     * @returns {Object} - The result of the insert operation.
     */
    async insertMany(dbName, collectionName, arrayOfDocuments) {
        const collection = await this.getCollection(dbName, collectionName);
        return collection.insertMany(arrayOfDocuments);
      }

    /**
     * updates one document into a collection.
     * @param {string} dbName - The name of the database.
     * @param {string} collectionName - The name of the collection.
     * @param {Object} update - Object to be updated
     * @returns {Object} - The result of the insert operation.
     */
    async updateOne(dbName, collectionName, update) {
      const collection = await this.getCollection(dbName, collectionName);
      return collection.updateOne( {"_id" : ObjectID(update._id)}, {$set: update});
    }

    /**
     * updates one document into a collection.
     * @param {string} dbName - The name of the database.
     * @param {string} collectionName - The name of the collection.
     * @param {Object} deleteObject - Object to be deleted
     * @returns {Object} - The result of the insert operation.
     */
    async deleteOne(dbName, collectionName, deleteObject) {
      const collection = await this.getCollection(dbName, collectionName);
      return collection.deleteOne( { "_id" : ObjectID(deleteObject._id) });
    }

    /**
     * Gets all documents from a collection.
     * @param {string} dbName - The name of the database.
     * @param {string} collectionName - The name of the collection.
     * @returns {Object[]} - The documents.
     */
    async find(dbName, collectionName) {
      const collection = await this.getCollection(dbName, collectionName);
      return collection.find({}).toArray();
    }

    /**
     * updates one document into a collection.
     * @param {string} dbName - The name of the database.
     * @param {string} collectionName - The name of the collection.
     * @param {Object} findObject - Object to be found
     * @returns {Object} - The result of the insert operation.
     */
    async findOne(dbName, collectionName, findObject) {
      const collection = await this.getCollection(dbName, collectionName);
      return collection.findOne( { "_id" : ObjectID(findObject._id) });
    }
  }

  module.exports = { mongowrapper }
