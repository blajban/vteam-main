const { MongoWrapper } = require('../mongowrapper');
const mongo = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectId;

jest.mock("mongodb", () => {
    return {
      MongoClient: {
        connect: jest.fn().mockResolvedValue({
          db: jest.fn().mockReturnValue({
            collection: jest.fn().mockReturnValue('mockedCollection'),
          }),
        }),
      },
      ObjectId: jest.fn().mockImplementation(() => "mockedObjectId"),
    };
  });


describe('MessageBroker', () => {
  let wrapper;
  const testCollectionName = 'testCollection';
  const testDocument = { 
    name: 'test'
  };
  const testArrayOfDocuments = [
    {
      name: 'doc1'
    },
    {
      name: 'doc2'
    }
  ];
  const testUpdate = {
    name: 'updated' 
  };
  const testDeleteObject = { 
    name: 'test'
  };

  beforeEach(async () => {
    wrapper = await new MongoWrapper('mydb');
  });

  describe('constructor', () => {
    it('Initialises with the correct settings', async () => {
      expect(wrapper.url).toBe('mongodb://mongodb:27017/mydb');
      expect(wrapper.dbName).toBe('mydb');
      expect(mongo.connect).toHaveBeenCalledWith("mongodb://mongodb:27017/mydb", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
      expect(wrapper.client).toBeInstanceOf(Object);
    });
  });

  describe('getCollection', () => {
    it('return the specified collection', async () => {
      const result = await wrapper.getCollection(testCollectionName);
      expect(result).toEqual('mockedCollection');
    });
  });

  describe('insertOne', () => {
    it('should insert a single document in the specified collection', async () => {
      const testCollection = { 
          insertOne: jest.fn().mockResolvedValue({
            result: { ok: 1 } 
          })
      };
      wrapper.getCollection = jest.fn().mockReturnValue(testCollection);
      const result = await wrapper.insertOne(testCollectionName, testDocument);
      expect(result.result.ok).toEqual(1);
      expect(testCollection.insertOne).toHaveBeenCalledWith(testDocument);
    });
  });

  describe('insertOneUser', () => {
    it('should insert a single user in the specified collection', async () => {
      const testCollection = { 
        insertOne: jest.fn().mockResolvedValue({
          result: { ok: 1 } 
        })
      };
      wrapper.getCollection = jest.fn().mockReturnValue(testCollection);
      const result = await wrapper.insertOneUser(testCollectionName, testDocument);
      expect(result.result.ok).toEqual(1);
      expect(testCollection.insertOne).toHaveBeenCalledWith(testDocument);
    });
  });

  describe('insertMany', () => {
    it('should insert multiple documents in the specified collection', async () => {
      const testCollection = { 
        insertMany: jest.fn().mockResolvedValue({
          result: { ok: 1 } 
        })
      };
      wrapper.getCollection = jest.fn().mockReturnValue(testCollection);
      const result = await wrapper.insertMany(testCollectionName, testArrayOfDocuments);
      expect(result.result.ok).toEqual(1);
      expect(testCollection.insertMany).toHaveBeenCalledWith(testArrayOfDocuments);
    });
  });

  describe('updateOne', () => {
    it('should update a single document in the specified collection', async () => {
      const testCollection = { 
        updateOne: jest.fn().mockResolvedValue({
          result: { ok: 1 } 
        })
      };
      
      wrapper.getCollection = jest.fn().mockReturnValue(testCollection);
      const result = await wrapper.updateOne(testCollectionName, { _id: 5 }, testUpdate);
      expect(result.result.ok).toEqual(1);
      expect(testCollection.updateOne).toHaveBeenCalledWith({ "_id" : ObjectID({ _id: 5 })}, {$set: testUpdate});
    });
  });

  describe('updateOneUser', () => {
    it('should update a single user in the specified collection', async () => {
      const testCollection = { 
        updateOne: jest.fn().mockResolvedValue({
          result: { ok: 1 } 
        })
      };
      wrapper.getCollection = jest.fn().mockReturnValue(testCollection);
      const result = await wrapper.updateOneUser(testCollectionName, 5, testUpdate);
      expect(result.result.ok).toEqual(1);
      expect(testCollection.updateOne).toHaveBeenCalledWith({ "_id" : 5 }, {$set: testUpdate});
    });
  });

  describe('deleteOne', () => {
    it('should delete a single document from the specified collection', async () => {
      const testCollection = { 
        deleteOne: jest.fn().mockResolvedValue({
          result: { ok: 1 } 
        })
      };
      wrapper.getCollection = jest.fn().mockReturnValue(testCollection);
      const result = await wrapper.deleteOne(testCollectionName, testDeleteObject);
      expect(result.result.ok).toEqual(1);
      expect(testCollection.deleteOne).toHaveBeenCalledWith({ "_id" : ObjectID({ _id: 5 })});
    });
  });

  describe('deleteOneUser', () => {
    it('should delete a single user document from the specified collection', async () => {
      const testCollection = { 
        deleteOne: jest.fn().mockResolvedValue({
          result: { ok: 1 } 
        })
      };
      wrapper.getCollection = jest.fn().mockReturnValue(testCollection);
      const result = await wrapper.deleteOneUser(testCollectionName, 5);
      expect(result.result.ok).toEqual(1);
      expect(testCollection.deleteOne).toHaveBeenCalledWith({ "_id" : 5 });
    });
  });

  describe('find', () => {
    it('should find all documents in the specified collection', async () => {
      const testCollection = { 
        find: jest.fn().mockReturnThis(), 
        toArray: jest.fn().mockResolvedValue(testArrayOfDocuments) 
      };
      wrapper.getCollection = jest.fn().mockReturnValue(testCollection);
      const result = await wrapper.find(testCollectionName, {});
        expect(result).toEqual(testArrayOfDocuments);
        expect(testCollection.find).toHaveBeenCalledWith({});
        expect(testCollection.find().toArray).toHaveBeenCalled();
    });
  });

  describe('findUser', () => {
    it('should return all documents from the specified collection', async () => {
      const testCollection = { 
        find: jest.fn().mockReturnThis(), 
        toArray: jest.fn().mockResolvedValue(testArrayOfDocuments) 
      };
      wrapper.getCollection = jest.fn().mockReturnValue(testCollection);
      const result = await wrapper.findUser(testCollectionName);
      expect(result).toEqual(testArrayOfDocuments);
      expect(testCollection.find).toHaveBeenCalled();
      expect(testCollection.find().toArray).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find one document in the specified collection', async () => {
      const testCollection = { 
        findOne: jest.fn().mockResolvedValue(testDocument) 
      };
      wrapper.getCollection = jest.fn().mockReturnValue(testCollection);
      const result = await wrapper.findOne(testCollectionName, {}, {});
      expect(result).toEqual(testDocument);
      expect(testCollection.findOne).toHaveBeenCalledWith({}, {});
    });
  });

  describe('findOneUser', () => {
    it('should find one user document in the specified collection', async () => {
        const testCollection = { 
          findOne: jest.fn().mockResolvedValue(testDocument) 
        };
        wrapper.getCollection = jest.fn().mockReturnValue(testCollection);
        const result = await wrapper.findOneUser(testCollectionName, 5);
        expect(result).toEqual(testDocument);
        expect(testCollection.findOne).toHaveBeenCalledWith({ _id: 5});
    });
  });


});
