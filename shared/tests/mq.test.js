const { MessageBroker } = require('../mq');

jest.mock('amqplib', () => {
  return {
    connect: jest.fn(() => Promise.resolve({
      createChannel: jest.fn(() => Promise.resolve({
        assertExchange: jest.fn(() => Promise.resolve()),
        assertQueue: jest.fn(() => Promise.resolve({ queue: 'queue-name' })),
        bindQueue: jest.fn(),
        consume: jest.fn((queue, cb) => cb({
          content: '{"eventType":"testEvent","origin":"testService","data":{"name":"erik","email":"erik@erik.se"}}',
          properties: { correlationId: '5' },
        })),
        publish: jest.fn(),
        sendToQueue: jest.fn(),
        prefetch: jest.fn(),
        ack: jest.fn(),
      })),
    })),
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
        email: 'erik@erik.se',
      };

      const event = broker.constructEvent(eventType, data);

      expect(event).toEqual({
        eventType: 'testEvent',
        origin: 'testService',
        data: {
          name: 'erik',
          email: 'erik@erik.se',
        },
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
          email: 'erik@erik.se',
        },
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
          email: 'erik@erik.se',
        },
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
          email: 'erik@erik.se',
        },
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
          email: 'erik@erik.se',
        },
      };
      await broker.publishAll(event);
      expect(broker.channel.assertExchange).toHaveBeenCalledWith('system', 'direct', { durable: false });
      expect(broker.channel.publish).toHaveBeenCalledWith('system', 'testEvent', Buffer.from(JSON.stringify(event)));
    });
  });

  describe('request', () => {
    it('send request and receive response', async () => {
      const callback = jest.fn();
      const idSpy = jest.spyOn(broker, 'generateId').mockReturnValue('5');

      const reqEvent = {
        eventType: 'testReq',
        origin: 'testService',
        data: {
          name: 'erik',
          email: 'erik@erik.se',
        },
      };

      await broker.request(reqEvent, callback);

      expect(callback).toHaveBeenCalled();
      expect(broker.channel.consume).toHaveBeenCalled();
      expect(broker.channel.sendToQueue).toHaveBeenCalledWith(
        'testReq',
        Buffer.from(JSON.stringify(reqEvent)),
        {
          'correlationId': '5',
          'replyTo': 'queue-name',
        },
      );
      expect(idSpy).toHaveBeenCalled();
    });
  });

  describe('response', () => {
    it('listen for request and send response', async () => {
      const callbackSpy = jest.spyOn(broker, 'generateId').mockReturnValue({
        eventType: 'testReq',
        origin: 'testService',
        data: {
          name: 'erik',
          email: 'erik@erik.se',
        },
      });

      await broker.response('queue-name', callbackSpy);
      expect(callbackSpy).toHaveBeenCalled();
    });
  });
});
