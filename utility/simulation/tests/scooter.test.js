const { Scooter } = require('../src/scooter');

describe('Scooter', () => {
  let scooter;
  let scooterInfo;

  beforeEach(() => {
    scooterInfo = {
      _id: "55",
      properties: {
        lat: 76,
        lng: 77,
        speed: 0,
        battery: 100,
        location: "malmo",
      },
    };
    scooter = new Scooter(scooterInfo);
  });

  describe('constructor', () => {
    it('initialize with a empty log', () => {
      expect(scooter.info.log).toEqual([]);
    });

    it('correct id', () => {
      expect(scooter.info._id).toBe('55');
    });
  });

  describe('getScooterInfo', () => {
    it('correct id', () => {
      expect(scooter.info._id).toBe('55');
    });
    it('correct lat', () => {
      expect(scooter.info.properties.lat).toBe(76);
    });
  });

  describe('unlockScooter', () => {
    it('correct user ID and status', () => {
      scooter.unlockScooter(1, 3000, 'claimed', '200');
      expect(scooter.info.userId).toBe('200');
      expect(scooter.info.status).toBe('claimed');
    });
    it('start time set', () => {
      scooter.unlockScooter(1, 3000, 'claimed', '200');
      expect(scooter.startTime).toBeInstanceOf(Date);
    });
  });

  describe('lockScooter', () => {
    it('correct user ID and status', () => {
      scooter.lockScooter('available', '0');
      expect(scooter.info.userId).toBe('0');
      expect(scooter.info.status).toBe('available');
    });
    it('correct log', () => {
      scooter.unlockScooter(1, 3000, 'claimed', '200');
      scooter.lockScooter('available', '0');
      expect(scooter.info.log[0].userId).toBe('200');
      expect(scooter.info.log[0].start).toBeInstanceOf(Date);
      expect(scooter.info.log[0].end).toBeInstanceOf(Date);
    });
    it('startTime reset to null', () => {
      scooter.unlockScooter(1, 3000, 'claimed', '200');
      scooter.lockScooter('available', '0');
      expect(scooter.startTime).toBeNull();
    });
  });

  describe('simulateScooter', () => {
    it('correct battery level, tick and speed above 0', () => {
      scooter.unlockScooter(1, 3000, 'claimed', '200');
      scooter.simulateScooter();
      expect(scooter.info.properties.battery).toBe(99);
      expect(scooter.tick).toBe(1);
      expect(scooter.info.properties.speed).toBeGreaterThan(0);
    });
  });

  describe('activate and remove', () => {
    it('activate sets interval', () => {
      scooter.activate(100);
      expect(scooter.idleInterval).toBe(100);
    });

    it('remove removes interval', () => {
      scooter.activate(100);
      const mockClearInterval = jest.spyOn(global, 'clearInterval');
      scooter.remove();
      expect(mockClearInterval).toHaveBeenCalledTimes(1);
      mockClearInterval.mockRestore();
    });
  });

  describe('lowBattery', () => {
    it('expect battery to be low when < 20', () => {
      scooter.info.properties.battery = 19;
      expect(scooter.info.properties.battery).toBe(19);
      const batteryStatus = scooter.lowBattery();
      expect(batteryStatus).toBe(true);
    });
  });

  describe('outOfBounds', () => {
    it('return true if out of bounds', () => {
      expect(scooter.outOfBounds()).toBe(true);
    });

    it('return true if out of bounds', () => {
      scooter.info.properties.lat = 55.5;
      scooter.info.properties.lng = 13;
      expect(scooter.outOfBounds()).toBe(false);
    });

  });

});
