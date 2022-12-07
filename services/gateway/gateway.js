const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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
