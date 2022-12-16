const { ScooterHandler } = require('./scooter_handler');

describe('ScooterHandler', () => {
  let scooterHandler;
  let scooters;

  beforeEach(() => {
    scooters = [
      { _id: '1', status: 'available', userId: 0, properties: { lat: 37.775, lng: -122.4183 } },
      { _id: '2', status: 'available', userId: 0, properties: { lat: 37.775, lng: -122.4183 } },
      { _id: '3', status: 'available', userId: 0, properties: { lat: 37.775, lng: -122.4183 } }
    ];
    scooterHandler = new ScooterHandler(scooters);
  });

  describe('constructor', () => {
    it('should initialize the scooters property with an array of scooters', () => {
      expect(scooterHandler.scooters).toEqual(scooters);
    });

    it('should convert the _id property of each scooter to a string', () => {
      expect(scooterHandler.scooters[0]._id).toBe('1');
      expect(scooterHandler.scooters[1]._id).toBe('2');
      expect(scooterHandler.scooters[2]._id).toBe('3');
    });
  });

  describe('addActiveScooter', () => {
    it('should add a new scooter to the list of active scooters', () => {
      const newScooter = { _id: '4', status: 'available', userId: 0, properties: { lat: 37.775, lng: -122.4183 } };
      scooterHandler.addActiveScooter(newScooter);
      expect(scooterHandler.scooters).toContain(newScooter);
    });
  });

  describe('activeScooters', () => {
    it('should return the list of active scooters', () => {
      expect(scooterHandler.activeScooters()).toEqual(scooters);
    });
  });

  describe('updateActiveScooter', () => {
    it('should update the data of an active scooter', () => {
      const updatedScooter = { _id: '1', status: 'claimed', userId: '123', properties: { lat: 37.775, lng: -122.4183 } };
      scooterHandler.updateActiveScooter(updatedScooter);
      expect(scooterHandler.scooters[0].userId).toEqual(updatedScooter.userId);
    });

    it('should throw an error if the scooter with the given ID is not found', () => {
      const updatedScooter = { _id: '4', status: 'claimed', userId: '123', properties: { lat: 37.775, lng: -122.4183 } };
      expect(() => { scooterHandler.updateActiveScooter(updatedScooter); }).toThrow();
    });
  });
 
  describe('removeActiveScooter', () => {
    it('should remove an active scooter from the list', () => {
      const scooterToDelete = scooters[1];
      scooterHandler.removeActiveScooter(scooterToDelete);
      expect(scooterHandler.scooters).not.toContain(scooterToDelete);
    });

    it('should throw an error if the scooter with the given ID is not found', () => {
      const scooterToDelete = { _id: '4', status: 'claimed', userId: '123', properties: { lat: 37.775, lng: -122.4183 } };
      expect(() => { scooterHandler.removeActiveScooter(scooterToDelete); }).toThrow();
    });
  });
  
  describe('unlockScooter', () => {
    it('should unlock a scooter and update its status to "claimed"', () => {
      const unlockedScooter = scooterHandler.unlockScooter('1', '123');
      expect(unlockedScooter.status).toBe('claimed');
      expect(unlockedScooter.userId).toBe('123');
    });

    it('should throw an error if the scooter with the given ID is not found', () => {
      expect(() => { scooterHandler.unlockScooter('4', '123'); }).toThrow();
    });
  });
  
  describe('scooterUnlocked', () => {
    it('should update the status and user ID of an unlocked scooter', () => {
      const unlockedScooter = { _id: '1', status: 'claimed', userId: '123', properties: { lat: 37.775, lng: -122.4183 } };
      const updatedScooter = scooterHandler.scooterUnlocked(unlockedScooter);
      expect(updatedScooter).toEqual(unlockedScooter);
    });

    it('should throw an error if the scooter with the given ID is not found', () => {
      const unlockedScooter = { _id: '4', status: 'claimed', userId: '123', properties: { lat: 37.775, lng: -122.4183 } };
      expect(() => { scooterHandler.scooterUnlocked(unlockedScooter); }).toThrow();
    });
  });
  
  describe('lockScooter', () => {
    it('should lock a scooter and update its status to "available"', () => {
      const lockedScooter = scooterHandler.lockScooter('1');
      expect(lockedScooter.status).toBe('available');
      expect(lockedScooter.userId).toBe(0);
    });

    it('should throw an error if the scooter with the given ID is not found', () => {
      expect(() => { scooterHandler.lockScooter('4'); }).toThrow();
    });
  });
  
  describe('scooterLocked', () => {
    it('should update the status and user ID of a locked scooter', () => {
      const lockedScooter = { _id: '1', status: 'available', userId: 0, properties: { lat: 37.775, lng: -122.4183 } };
      const updatedScooter = scooterHandler.scooterLocked(lockedScooter);
      expect(updatedScooter).toEqual(lockedScooter);
    });

    it('should throw an error if the scooter with the given ID is not found', () => {
      const lockedScooter = { _id: '4', status: 'available', userId: 0, properties: { lat: 37.775, lng: -122.4183 } };
      expect(() => { scooterHandler.scooterLocked(lockedScooter); }).toThrow();
    });
  });
  
  describe('updateScooterPosition', () => {
    it('should update the position of a scooter', () => {
      const updatedScooter = { _id: '1', status: 'available', userId: 0, properties: { lat: 37.7751, lng: -122.4184 } };
      scooterHandler.updateScooterPosition(updatedScooter);
      expect(scooterHandler.scooters[0]).toEqual(updatedScooter);
    });

    it('should throw an error if the scooter with the given ID is not found', () => {
      const updatedScooter = { _id: '4', status: 'available', userId: 0, properties: { lat: 37.7751, lng: -122.4184 } };
      expect(() => { scooterHandler.updateScooterPosition(updatedScooter); }).toThrow();
    });
  });
});