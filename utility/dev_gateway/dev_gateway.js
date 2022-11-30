
const { MessageBroker } = require('../../shared/mq')
const { host, exchanges, eventTypes } = require('../../shared/resources');
const cors = require('cors');



const express = require('express');
const app = express();
const port = 8889;
const mesBroker = new MessageBroker(host, exchanges.scooters, "web_server");

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send("Hello!");
})

app.get('/send/:exchange/:event', async (req, res) => {
  let broker = mesBroker;
  const e = broker.constructEvent(req.params.event, { data: "data!" });
  broker.changeExchange(req.params.exchange);
  await broker.publish(e);
  broker.changeExchange(exchanges.system);
  res.json({ event_published: e });
});

app.get('/log', async (req, res) => {
  let broker = mesBroker;
  const e = broker.constructEvent(eventTypes.adminEvents.getLog, { data: "request!" });
  await broker.request(e, (data) => {
    res.json(data);
  })

});

app.listen(port, () => {
  console.log(`Example gateway listening on port ${port}`)
})