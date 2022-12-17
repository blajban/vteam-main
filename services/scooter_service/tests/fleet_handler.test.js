const { FleetHandler } = require('../src/fleet_handler');

/**
 * Mock for MongoWrapper class.
 */
class MockMongoWrapper {
  constructor(scooters) {
    this.scooters = scooters;
  }
  async insertOne(collectionName, document) {
    document._id = 5555;
    this.scooters.push(document);
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

    return null;
    
  }

  async updateOne(collectionName, obj, update) {
    for (let i = 0; i < this.scooters.length; i++) {
      if (this.scooters[i]._id === obj._id) {

        if (update.hasOwnProperty('status')) {
          this.scooters[i].status = update.status;
        }

        if (update.hasOwnProperty('properties')) {
          if (update.properties.hasOwnProperty('location')) {
            this.scooters[i].properties.location = update.properties.location;
          }
          if (update.properties.hasOwnProperty('lat')) {
            this.scooters[i].properties.lat = update.properties.lat;
          }
          if (update.properties.hasOwnProperty('lng')) {
            this.scooters[i].properties.lng = update.properties.lng;
          }
        }
    
        if (update.hasOwnProperty('properties.location')) {
          this.scooters[i].properties.location = update['properties.location'];
        }
    
        if (update.hasOwnProperty('properties.lat')) {
          this.scooters[i].properties.lat = update['properties.lat'];
        }
    
        if (update.hasOwnProperty('properties.lng')) {
          this.scooters[i].properties.lng = update['properties.lng']
        }

        return { modifiedCount: 1 };

      }
    }
    return { modifiedCount: 0 };
  }

  async deleteOne(collectionName, id) {
    for (let i = 0; i < this.scooters.length; i++) {
      if (this.scooters[i]._id === id._id) {
        this.scooters.splice(i, 1);
        return { deletedCount: 1 };
      }
    }
    return { deletedCount: 0 };
  }
}

/**
 * TESTS
 */
describe('FleetHandler', () => {
    let fleetHandler;
    let db;
  
    beforeEach(async () => {
      db = new MockMongoWrapper([
        {
          _id: '123',
          status: 'available',
          userId: 0,
          properties: {
            location: 'goteborg',
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
            location: 'goteborg',
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
            location: 'stockholm',
            lat: 37.775,
            lng: -122.4183,
            speed: 0,
            battery: 100
          },
          log: []
        }
      ]);

      fleetHandler = new FleetHandler(db);
    });
  
    describe('getScooters', () => {
      it('return empty array if no scooters are found', async () => {
        const scooters = await fleetHandler.getScooters({ _id: '1234' });
        expect(scooters).toEqual([]);
      });
  
      it('return a single scooter with an ID', async () => {
        const scooters = await fleetHandler.getScooters({ _id: '123' });
        const scooterFromDb = await db.findOne("scooters", { _id: '123' });
        expect(scooters).toEqual(scooterFromDb);
    });

    it('return all scooters with a certain location', async () => {
      const scooters = await fleetHandler.getScooters({ location: 'goteborg' });
      const scootersFromDb = await db.find("scooters", { 'properties.location': 'goteborg' });
      expect(scooters).toEqual(scootersFromDb);
    });

    it('return all scooters', async () => {
      const scooters = await fleetHandler.getScooters();
      const scootersFromDb = await db.find("scooters", {})
      expect(scooters).toEqual(scootersFromDb);
    });
  });

  describe('addScooter', () => {
    it('add a new scooter to the db', async () => {
      const newScooterInfo = {
        location: 'eksjö',
        lat: 37.775,
        lng: -122.4183
      };
      const newScooter = await fleetHandler.addScooter(newScooterInfo);
      const scooters = await db.findOne('scooters', { _id: newScooter._id });
      expect(scooters).toEqual(newScooter);
    });
  });

  describe('updateScooters', () => {
    it('update multiple scooters in the db', async () => {
      const updatedScooters = [
        {
          _id: '123',
          status: 'claimed',
          userId: 0,
          properties: {
            location: 'goteborg',
            lat: -37.775,
            lng: 122.4183,
            speed: 0,
            battery: 100
          },
          log: []
        },
        {
          _id: '456',
          status: 'claimed',
          userId: 0,
          properties: {
            location: 'goteborg',
            lat: -37.775,
            lng: 122.4183,
            speed: 0,
            battery: 100
          },
          log: []
        },
        {
          _id: '789',
          status: 'claimed',
          userId: 0,
          properties: {
            location: 'stockholm',
            lat: -37.775,
            lng: 122.4183,
            speed: 0,
            battery: 100
          },
          log: []
        }
      ];

      await fleetHandler.updateScooters(updatedScooters);
      const scooters = await db.find('scooters', {});
      expect(scooters).toEqual(updatedScooters);
    });
  });

  describe('updateScooter', () => {
    it('update a single scooter in the db', async () => {
      const scooterToUpdate = {
          _id: '789',
          status: 'available',
          location: 'eksjö',
          lat: -37.775,
          lng: 2.4183,
        };

      await fleetHandler.updateScooter(scooterToUpdate);
      const scooter = await db.findOne('scooters', { _id: scooterToUpdate._id });
      expect(scooter.status).toEqual(scooterToUpdate.status);
      expect(scooter.properties.location).toEqual(scooterToUpdate.location);
      expect(scooter.properties.lat).toEqual(scooterToUpdate.lat);
      expect(scooter.properties.lng).toEqual(scooterToUpdate.lng);
    });
  });

  describe('removeScooter', () => {
    it('remove a scooter from the db', async () => {
      await fleetHandler.removeScooter({ _id: '123' });
      const scooterAfterRemoval = await db.findOne('scooters', { _id: '123' });
      expect(scooterAfterRemoval).toEqual(null);
    });
  });
});




  