const { Scooter } = require('../src/scooter');
const { ScooterEvents } = require('../src/scooter_events');

jest.mock('../../../shared/mq', () => {
  const mq = {
    MessageBroker: {
      onEvent: jest.fn(),
      constructEvent: jest.fn().mockImplementation(() => ({
        type: 'fakeEvent',
        data: { fake: 'data' }
      })),
			publish: jest.fn()
    }
  };
  return mq;
});

describe('ScooterEvents', () => {
  let broker;
  let scooterInfo;
  let scooter;
  let scooterEvents;

  beforeEach(() => {
    scooterInfo = {
      _id: "55",
      properties: {
        lat: 76,
        lng: 77,
        speed: 0,
        battery: 19,
        location: "malmo",
      },
    };

  jest.useFakeTimers();

  const { MessageBroker } = require('../../../shared/mq');
  	broker = MessageBroker;
    scooter = new Scooter(scooterInfo);
    scooterEvents = new ScooterEvents(broker);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('init', () => {
    it('onEvent called twice, interval once and scooter activate once', () => {

      const brokerOnEventSpy = jest.spyOn(broker, 'onEvent');
      const mockSetInterval = jest.spyOn(global, 'setInterval');
      const scooterActivateSpy = jest.spyOn(scooter, 'activate');

      scooterEvents.init(scooter);
      expect(mockSetInterval).toHaveBeenCalledTimes(1);
      expect(scooterActivateSpy).toHaveBeenCalledTimes(1);
      expect(brokerOnEventSpy).toHaveBeenCalledTimes(2);
      mockSetInterval.mockRestore();
      brokerOnEventSpy.mockRestore();
      scooterActivateSpy.mockRestore();
    });
  });

  describe('reportWhileMoving', () => {
    it('publish called three times', () => {
      const brokerPublishSpy = jest.spyOn(broker, 'publish');
      scooterEvents.reportWhileMoving(scooter);
      expect(brokerPublishSpy).toHaveBeenCalledTimes(3);
      brokerPublishSpy.mockRestore();
    });
  });

});