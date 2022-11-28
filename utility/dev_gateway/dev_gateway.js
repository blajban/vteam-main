
const { MessageBroker } = require('../../shared/mq')
const { host, exchanges, eventTypes } = require('../../shared/resources');
const cors = require('cors');



const express = require('express')
const app = express()
const port = 8080


app.use(async (req, res, next) => {
    req.broker = await new MessageBroker(host, exchanges.scooters, "web_server");
    next();
})
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send("Hello!");
})

app.get('/send/:exchange/:event', async (req, res) => {
  const e = req.broker.constructEvent(req.params.event, { data: "data!" });
  req.broker.changeExchange(req.params.exchange);
  await req.broker.publish(e);
  req.broker.changeExchange(exchanges.system);
  res.json({ event_published: e });
});

app.get('/log', async (req, res) => {
  const e = req.broker.constructEvent(eventTypes.adminEvents.getLog, { data: "request!" });
  await req.broker.request(e, (data) => {
    res.json(data);
  })

});

app.listen(port, () => {
  console.log(`Example gateway listening on port ${port}`)
})