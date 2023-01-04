const { MessageBroker } = require('../mq');

jest.mock('amqplib', () => {
  return {
    connect: jest.fn(() => Promise.resolve({
      createChannel: jest.fn(() => Promise.resolve({
        assertExchange: jest.fn(() => Promise.resolve()),
        assertQueue: jest.fn(() => Promise.resolve({ queue: 'queue-name' })),
        bindQueue: jest.fn(),
        consume: jest.fn((queue, cb) => cb({ 
          content: '{"eventType":"testEvent","origin":"testService","data":{"name":"erik","email":"erik@erik.se"}}'
        })),
        publish: jest.fn()
      }))
    }))
  };
});



describe('MessageBroker', () => {
  let broker;

  beforeEach(async () => {
    broker = await new MessageBroker('amqp://localhost', 'testService');
  });

  describe('constructor', () => {
    it('Initialises with the correct settings', async () => {
      expect(broker.exchange).toBe('system');
      expect(broker.serviceName).toBe('testService');
      expect(broker.connection).toBeInstanceOf(Object);
      expect(broker.channel).toBeInstanceOf(Object);
    });
  });

  describe('constructEvent', () => {
    it('creates a valid event object', () => {
      const eventType = 'testEvent';
      const data = {
        name: 'erik',
        email: 'erik@erik.se'
      };

      const event = broker.constructEvent(eventType, data);

      expect(event).toEqual({
        eventType: 'testEvent',
        origin: 'testService',
        data: {
          name: 'erik',
          email: 'erik@erik.se'
        }
      });
    });
  });

  describe('onEvent', () => {
    it('calls callback function', async () => {
      const callback = jest.fn();
      const eventType = 'testEvent';
      await broker.onEvent(eventType, callback);

      const event = {
        eventType: 'testEvent',
        origin: 'testService',
        data: {
          name: 'erik',
          email: 'erik@erik.se'
        }
      };

      await broker.publish(event);

      expect(callback).toHaveBeenCalledWith(event);
    });
  });

  describe('publish', () => {
    it('publish event', async () => {
      const event = {
        eventType: 'testEvent',
        origin: 'testService',
        data: {
          name: 'erik',
          email: 'erik@erik.se'
        }
      };
      await broker.publish(event);
      expect(broker.channel.assertExchange).toHaveBeenCalledWith('system', 'direct', { durable: false });
      expect(broker.channel.publish).toHaveBeenCalledWith('system', 'testEvent', Buffer.from(JSON.stringify(event)));
    });
  });

  describe('onAllEvents', () => {
    it('calls callback function', async () => {
      const callback = jest.fn();
      await broker.onAllEvents(callback);

      const event = {
        eventType: 'testEvent',
        origin: 'testService',
        data: {
          name: 'erik',
          email: 'erik@erik.se'
        }
      };

      await broker.publish(event);

      expect(callback).toHaveBeenCalledWith(event);
    });
  });

  describe('publishAll', () => {
    it('sends event to all', async () => {
      const event = {
        eventType: 'testEvent',
        origin: 'testService',
        data: {
          name: 'erik',
          email: 'erik@erik.se'
        }
      };
      await broker.publishAll(event);
      expect(broker.channel.assertExchange).toHaveBeenCalledWith('system', 'direct', { durable: false });
      expect(broker.channel.publish).toHaveBeenCalledWith('system', 'testEvent', Buffer.from(JSON.stringify(event)));
    });
  });

  describe('request - response', () => {
    it('send request and receive response', async () => {
      const reqEvent = {
        eventType: 'testReq',
        origin: 'testService',
        data: {
          name: 'erik',
          email: 'erik@erik.se'
        }
      };
      const resEvent = {
        eventType: 'testRes',
        origin: 'testService',
        data: {
          name: 'erik',
          email: 'erik@erik.se'
        }
      };

    });
  });
  // request

  // response

});
