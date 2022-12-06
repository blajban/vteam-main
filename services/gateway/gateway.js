const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


//const { MessageBroker } = require('../../shared/mq')
//const { host, eventTypes } = require('../../shared/resources');
//const mesBroker = new MessageBroker(host, "web_server");

const app = express();
const port = 3500;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const routes = require('./routes');

routes(app);

app.listen(port, () => {
  console.log(`Gateway listening on port ${port}`)
})

const router = express.Router();

app.use('/api', router);

app.use(function(req, res) {
  res.status(404).send( { error: {
      description: 'Couldn\'t find the requested resource \'' + req.originalUrl + '\'',
      code: 404,
      message: 'Not Found'
    }
  });
});



/*

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

*/


    



