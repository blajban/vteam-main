const { FleetHandler } = require('../src/fleet_handler');

class MockMongoWrapper {
  constructor() {
    this.db = [
      {
        _id: '123',
        status: 'available',
        userId: 0,
        properties: {
          location: 'San Francisco',
          lat: 37.775,
          lng: -122.4183,
          speed: 0,
          battery: 100
        },
        log: []
      },
      {
        _id: '456',
        status: 'available',
        userId: 0,
        properties: {
          location: 'San Francisco',
          lat: 37.775,
          lng: -122.4183,
          speed: 0,
          battery: 100
        },
        log: []
      },
      {
        _id: '789',
        status: 'available',
        userId: 0,
        properties: {
          location: 'Stockholm',
          lat: 37.775,
          lng: -122.4183,
          speed: 0,
          battery: 100
        },
        log: []
      }
    ]
  }
  async insertOne(collectionName, document) {
    // Return a mock value for the insertOne method
    return { insertedCount: 1 };
  }

  async find(collectionName, filter) {
    const result = [];

    if (filter.hasOwnProperty('properties.location')) {
      
      for (const scooter of this.scooters) {
        
        if (scooter.properties.location === filter['properties.location']) {
          result.push(scooter);
        }
      }

      return result;
    }


    return this.scooters;
  }

  async findOne(collectionName, filter) {
    for (const scooter of this.scooters) {
      if (filter._id === scooter._id) {
        return scooter;
      }
    }

    return [];
    
  }

  async updateOne(collectionName, filter, update) {
    // Return a mock value for the updateOne method
    return { modifiedCount: 1 };
  }

  async deleteOne(collectionName, filter) {
    // Return a mock value for the deleteOne method
    return { deletedCount: 1 };
  }
}

describe('FleetHandler', () => {
    let fleetHandler;
    let db;
  
    beforeEach(async () => {
      db = new MockMongoWrapper();
      fleetHandler = new FleetHandler(db);
    });
  
    describe('getScooters', () => {
      it('should return an empty array if no scooters are found', async () => {
        const scooters = await fleetHandler.getScooters({ _id: '1234' });
        const dbResult = db.findOne("scooters", { _id: '1234' });
        expect(scooters).toEqual(dbResult);
      });
  
      it('should return a single scooter if an ID is provided', async () => {
        const newScooter = {
          _id: '123',
          status: 'available',
          userId: 0,
          properties: {
            location: 'San Francisco',
            lat: 37.775,
            lng: -122.4183,
            speed: 0,
            battery: 100
          },
          log: []
        };
        const scooters = await fleetHandler.getScooters({ _id: '123' });
        expect(scooters).toEqual([newScooter]);
    });

    it('should return all scooters with a matching location', async () => {
      const newScooter1 = {
        _id: '123',
        status: 'available',
        userId: 0,
        properties: {
          location: 'San Francisco',
          lat: 37.775,
          lng: -122.4183,
          speed: 0,
          battery: 100
        },
        log: []
      };
      const newScooter2 = {
        _id: '456',
        status: 'available',
        userId: 0,
        properties: {
          location: 'San Francisco',
          lat: 37.775,
          lng: -122.4183,
          speed: 0,
          battery: 100
        },
        log: []
      };
      const scooters = await fleetHandler.getScooters({ location: 'San Francisco' });
      expect(scooters).toEqual([newScooter1, newScooter2]);
    });

    it('should return all scooters if no options are provided', async () => {
      const scooters = [
        {
          _id: '123',
          status: 'available',
          userId: 0,
          properties: {
            location: 'San Francisco',
            lat: 37.775,
            lng: -122.4183,
            speed: 0,
            battery: 100
          },
          log: []
        },
        {
          _id: '456',
          status: 'available',
          userId: 0,
          properties: {
            location: 'San Francisco',
            lat: 37.775,
            lng: -122.4183,
            speed: 0,
            battery: 100
          },
          log: []
        },
        {
          _id: '789',
          status: 'available',
          userId: 0,
          properties: {
            location: 'Stockholm',
            lat: 37.775,
            lng: -122.4183,
            speed: 0,
            battery: 100
          },
          log: []
        }
      ]
      const returnedScooters = await fleetHandler.getScooters();
      expect(returnedScooters).toEqual(scooters);
    });
  });

  describe('#addScooter', () => {
    it('should add a new scooter to the database', async () => {
      const newScooterInfo = {
        location: 'San Francisco',
        lat: 37.775,
        lng: -122.4183
      };
      const newScooter = await fleetHandler.addScooter(newScooterInfo);
      const scooters = await db.find('scooters', { _id: newScooter._id });
      expect(scooters).toEqual([newScooter]);
    });
  });

  describe('#updateScooters', () => {
    it('should update multiple scooters in the database', async () => {
      const newScooter1 = {
        _id: '123',
        status: 'available',
        userId: 0,
        properties: {
          location: 'San Francisco',
          lat: 37.775,
          lng: -122.4183,
          speed: 0,
          battery: 100
        },
        log: []
      };
      const newScooter2 = {
        _id: '456',
        status: 'available',
        userId: 0,
        properties: {
          location: 'San Francisco',
          lat: 37.775,
          lng: -122.4183,
          speed: 0,
          battery: 100
        },
        log: []
      };
      await db.insertOne('scooters', newScooter1);
      await db.insertOne('scooters', newScooter2);
      newScooter1.status = 'claimed';
      newScooter2.status = 'claimed';
      await fleetHandler.updateScooters([newScooter1, newScooter2]);
      const scooters = await db.find('scooters', {});
      expect(scooters).toEqual([newScooter1, newScooter2]);
    });
  });

  describe('#updateScooter', () => {
    it('should update a single scooter in the database', async () => {
      const newScooter = {
        _id: '123',
        status: 'available',
        userId: 0,
        properties: {
          location: 'San Francisco',
          lat: 37.775,
          lng: -122.4183,
          speed: 0,
          battery: 100
        },
        log: []
      };
      await db.insertOne('scooters', newScooter);
      newScooter.status = 'claimed';
      await fleetHandler.updateScooter(newScooter);
      const scooters = await db.find('scooters', {});
      expect(scooters).toEqual([newScooter]);
    });
  });

  describe('#removeScooter', () => {
    it('should remove a scooter from the database', async () => {
      const newScooter = {
        _id: '123',
        status: 'available',
        userId: 0,
        properties: {
          location: 'San Francisco',
          lat: 37.775,
          lng: -122.4183,
          speed: 0,
          battery: 100
        },
        log: []
      };
      await db.insertOne('scooters', newScooter);
      const scooters = await db.find('scooters', {});
      expect(scooters).toEqual([newScooter]);
      await fleetHandler.removeScooter({ _id: '123' });
      const scootersAfterRemoval = await db.find('scooters', {});
      expect(scootersAfterRemoval).toEqual([]);
    });
  });
});




  