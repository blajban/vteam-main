const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3500;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.use('/:key', (req, res, next) => {
  const apiKey = req.params.key;
  console.log(apiKey);
  if (!apiKey || apiKey !== "hej"/*process.env.API_KEY*/) {
    res.status(401).json({error: 'unauthorised'})
  } else {
    next()
  }
})

const v1Router = require('./src/v1/v1Routes');
const v2Router = require('./src/v2/v2Routes');

app.use('/:key/v1', v1Router);
app.use('/:key/v2', v2Router);

app.listen(port, () => {
  console.log(`Gateway listening on port ${port}`)
})

app.use(function(req, res) {
  res.status(404).send( { error: {
      description: 'Couldn\'t find the requested resource \'' + req.originalUrl + '\'',
      code: 404,
      message: 'Not Found'
    }
  });
});
