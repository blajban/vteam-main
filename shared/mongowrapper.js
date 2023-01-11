const ObjectID = require('mongodb').ObjectId;
const mongo = require('mongodb').MongoClient;

/**
 * A class for creating MongoDB wrapper objects.
 */
class MongoWrapper {
  /**
   * Creates a MongoDB wrapper object.
   */
  constructor(dbName) {
    return this.#connectClient(dbName);
  }

  /**
   * Initiate, used to get around constructor async limitations.
   * @returns {object}
   */
  async #connectClient(dbName) {
    this.url = 'mongodb://mongodb:27017/mydb';
    this.dbName = dbName;

    try {
      const client = await mongo.connect(this.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.client = client;
      return this;
    } catch (e) {
      return {
        errors: {
          message: 'could not connect to mongo',
        },
      };
    }
  }

  /**
   * Gets a collection from MongoDB.
   * @param {string} collectionName - The name of the collection.
   * @returns {object} - The collection.
   */
  async getCollection(collectionName) {
    const db = this.client.db(this.dbName);
    return db.collection(collectionName);
  }

  async getNextId(collectionName, idName) {
    const counterCollectionName = `${collectionName}Counter`;
    const collection = await this.getCollection(counterCollectionName);

    const lastId = await collection.findOne({ '_id': idName });

    if (lastId === null) {
      const newId = {
        _id: idName,
        seq: 0,
      };

      collection.insertOne(newId);

      return newId.seq;
    }

    collection.deleteOne({ _id: lastId._id });
    const newId = {
      _id: idName,
      seq: lastId.seq + 1,
    };

    collection.insertOne(newId);

    return newId.seq;
  }

  /**
   * Inserts a document into a collection.
   * @param {string} collectionName - The name of the collection.
   * @param {object} document - The document to insert.
   * @returns {object} - The result of the insert operation.
   */
  async insertOne(collectionName, document) {
    const collection = await this.getCollection(collectionName);
    return collection.insertOne(document);
  }

  /**
   * Inserts a user into a collection.
   * @param {string} collectionName - The name of the collection.
   * @param {object} document - The document to insert.
   * @returns {object} - The result of the insert operation.
   */
  async insertOneUser(collectionName, document) {
    const collection = await this.getCollection(collectionName);
    return await collection.insertOne(document);
  }

  /**
   * Inserts many documents into a collection.
   * @param {string} collectionName - The name of the collection.
   * @param {Array} arrayOfDocuments - array with objects
   * @returns {Object} - The result of the insert operation.
   */
  async insertMany(collectionName, arrayOfDocuments) {
    const collection = await this.getCollection(collectionName);
    return collection.insertMany(arrayOfDocuments);
  }

  /**
   * updates one document into a collection.
   * @param {string} collectionName - The name of the collection.
   * @param {string} objectId - MongoDB Object id of object to be updated
   * @param {Object} update - Object to be updated
   * @returns {Object} - The result of the insert operation.
   */
  async updateOne(collectionName, objectId, update) {
    const collection = await this.getCollection(collectionName);
    return collection.updateOne({ '_id': ObjectID(objectId._id) }, { $set: update });
  }

  /**
   * updates one user document into a collection.
   * @param {string} collectionName - The name of the collection.
   * @param {number} userId - id of user to be updated.
   * @param {Object} update - User object to be updated.
   * @returns {Object} - The result of the insert operation.
   */
  async updateOneUser(collectionName, userId, update) {
    const collection = await this.getCollection(collectionName);
    return await collection.updateOne({ '_id': userId }, { $set: update });
  }

  /**
   * deletes one document from the collection.
   * @param {string} collectionName - The name of the collection.
   * @param {Object} deleteObject - Object to be deleted
   * @returns {Object} - The result of the delete operation.
   */
  async deleteOne(collectionName, deleteObject) {
    const collection = await this.getCollection(collectionName);
    return collection.deleteOne({ '_id': ObjectID(deleteObject._id) });
  }

  /**
   * deletes one user document from the collection.
   * @param {string} collectionName - The name of the collection.
   * @param {number} userId - id of the user to be deleted.
   * @returns {Object} - The result of the delete operation.
   */
  async deleteOneUser(collectionName, userId) {
    const collection = await this.getCollection(collectionName);
    return await collection.deleteOne({ '_id': userId });
  }

  /**
   * Gets all documents from a collection.
   * @param {string} collectionName - The name of the collection.
   * @returns {Object[]} - The documents.
   */
  async find(collectionName, query = {}) {
    if (query.hasOwnProperty('_id')) {
      query._id = ObjectID(query._id);
    }

    const collection = await this.getCollection(collectionName);
    return await collection.find(query).toArray();
  }

  /**
   * Gets all users documents from a collection.
   * @param {string} collectionName - The name of the collection.
   * @returns {Object[]} - The documents.
   */
  async findUser(collectionName) {
    const collection = await this.getCollection(collectionName);
    return await collection.find().toArray();
  }

  /**
   * gets one document from a collection.
   * @param {string} collectionName - The name of the collection.
   * @param {Object} query - What to query for
   * @param {Object} projection - Filters out fields if field=1 then print if 0 no print
   * @returns {Object} - The result of the findOne operation.
   */
  async findOne(collectionName, query, projection = {}) {
    if (query.hasOwnProperty('_id')) {
      query._id = ObjectID(query._id);
    }
    const collection = await this.getCollection(collectionName);
    return collection.findOne(query, projection);
  }

  /**
   * gets one user document from a collection.
   * @param {string} collectionName - The name of the collection.
   * @param {number} userId - id of the user to be find.
   * @returns {Object} - The result of the findOne operation.
   */
  async findOneUser(collectionName, userId) {
    const collection = await this.getCollection(collectionName);
    const filter = { _id: userId };
    return await collection.findOne(filter);
  }
}

module.exports = { MongoWrapper };
