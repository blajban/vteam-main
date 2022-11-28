const amqp = require('amqplib');
const { eventTypes } = require('./resources');

/**
 * Handles messages and events.
 * @usage 'const broker = await new MessageBroker('amqp://localhost', 'system', 'userService')'; - Don't forger 'await'.
 * @version 0.9
 * @author Erik Sjöberg
 */
class MessageBroker {
  /**
   * Constructor
   * @param {string} host - RabbitMQ url.
   * @param {string} exchange 
   * @param {string} serviceName
   * @returns {object}
   */
  constructor(host, exchange, serviceName) {
    return this.#init(host, exchange, serviceName);
  }

  /**
   * Initialize and return object to constructor (used to get around limitations in async in constructor).
   * @param {string} host 
   * @param {string} exchange 
   * @param {string} serviceName 
   * @returns {object}
   */
  async #init(host, exchange, serviceName) {
    this.exchange = exchange;
    this.serviceName = serviceName;
    this.connection = await amqp.connect(host)
    this.channel = await this.connection.createChannel()
    return this
  }

  /**
   * Returns a random string for use in request-response pattern (RPC).
   * @returns {string}
   */
  #generateId() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }

  /**
   * Construct event to use in the system. All events are assumed to have a type, an origin and a js object containing the data.
   * @param {string} eventType 
   * @param {object} data
   * @returns {mqEvent}
   */
  constructEvent(eventType, data) {
    return {
      eventType: eventType,
      origin: this.serviceName,
      data: data
    };
  }

  /**
   * Listen for events of a certain type and then execute callback. 
   * @param {string} eventType 
   * @param {function} cb - the message will be converted to js object and then sent to callback function.
   */
  async onEvent(eventType, cb) {
    await this.channel.assertExchange(this.exchange, 'direct', { durable: false });
    const q = await this.channel.assertQueue('', { exclusive: true });
    this.channel.bindQueue(q.queue, this.exchange, eventType);
    this.channel.consume(q.queue, (msg) => {
      cb(JSON.parse(msg.content));
    }, { noAck: true });
  }

  /**
   * Publish event.  
   * The message will only be forwarded to those who subscribe for the event type of the event.
   * @param {mqEvent} event - construct events with 'constructEvent'-function.
   */
  async publish(event) {
    await this.channel.assertExchange(this.exchange, 'direct', { durable: false });
    this.channel.publish(this.exchange, event.eventType, Buffer.from(JSON.stringify(event)));
  }

  /**
   * Subscribe to all events regardless of type. Note that it only subscribes to events to the default exchange (can be changed via optional parameter).
   * @param {function} cb 
   * @param {string} exchange - optional. Use another exchange than the MessageBroker was initialised with.
   */
  async onAllEvents(cb, exchange = this.exchange) {
    await this.channel.assertExchange(exchange, 'direct', { durable: false });
    const q = await this.channel.assertQueue('', { exclusive: true });

    Object.values(eventTypes).forEach((group) => {
      Object.values(group).forEach((type) => {
        this.channel.bindQueue(q.queue, exchange, type);
      });
    });

    this.channel.consume(q.queue, (msg) => {
      cb(JSON.parse(msg.content));
    }, { noAck: true });
  }

  /**
   * Publish event to all subscribers. Note that it only published to the default exchange (can be changed via optional parameter).
   * Note that it's only published 
   * @param {function} cb 
   * @param {string} exchange - optional. Use another exchange than the MessageBroker was initialised with.
   */
  async publishAll(event, exchange = this.exchange) {
    await this.channel.assertExchange(exchange, 'direct', { durable: false });
    Object.values(eventTypes).forEach((group) => {
      Object.values(group).forEach((type) => {
        this.channel.publish(exchange, type, Buffer.from(JSON.stringify(event)));
      });
    });
  }

  /**
   * Request data from a service via RPC-pattern. Sends a request event and runs callback when a reply arrives. 
   * @param {mqEvent} event 
   * @param {function} cb 
   */
  async request(event, cb) {
    const q = await this.channel.assertQueue('', { exclusive: true });
    const correlationId = this.#generateId();

    this.channel.consume(q.queue, (msg) => {
      if (msg.properties.correlationId === correlationId) {
        cb(JSON.parse(msg.content));
      }
    }, { noAck: true });

    this.channel.sendToQueue(event.eventType, Buffer.from(JSON.stringify(event)), {
      correlationId: correlationId,
      replyTo: q.queue
    });
  }

  /**
   * Responds with data via RPC-pattern. 
   * Listens for events with a certain type and runs a callback (that must return a js object) and then replies to the requester.
   * @param {string} eventType 
   * @param {function} cb - expects a callback function that returns data as a js object. 
   */
  async response(eventType, cb) {
    const q = await this.channel.assertQueue(eventType, { durable: false });
    this.channel.prefetch(1);

    this.channel.consume(eventType, (msg) => {
      const data = cb(JSON.parse(msg.content));
      this.channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(data)), {
        correlationId: msg.properties.correlationId
      });

      this.channel.ack(msg);
    })
  }

  changeExchange(newExchange) {
    this.exchange = newExchange;
  }
}

module.exports = { MessageBroker }
