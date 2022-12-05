
const { MessageBroker } = require('../../shared/mq')
const { host, eventTypes } = require('../../shared/resources');
const cors = require('cors');



const express = require('express');
const app = express();
const port = 8889;
const mesBroker = new MessageBroker(host, "web_server");

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send("Hello!");
})

app.get('/send/:event', async (req, res) => {
  let broker = await mesBroker;
  const e = broker.constructEvent(req.params.event, { data: "data!" });
  await broker.publish(e);
  res.json({ event_published: e });
});

app.get('/log', async (req, res) => {
  let broker = await mesBroker;
  const e = broker.constructEvent(eventTypes.adminEvents.getLog, { data: "request!" });
  await broker.request(e, (data) => {
    res.json(data);
  })

});

app.listen(port, () => {
  console.log(`Example gateway listening on port ${port}`)
})