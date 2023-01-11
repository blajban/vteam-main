const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateKey, isValid } = require('./src/auth/auth');

// Setup
const app = express();
const port = 3500;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/login', async (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_WEB_CLIENT_ID}&redirect_uri=http://localhost:9001`;
  res.redirect(url);
});

app.get('/api-key', async (req, res) => {
  res.status(200).send({
    code: 200,
    description: 'API key generated',
    key: await generateKey(),
  });
});

// Check API key
app.use(async (req, res, next) => {
  const apiKey = req.get('x-api-key');
  if (await isValid(apiKey)) {
    next();
  } else {
    res.status(401).send({
      error: {
        description: 'API key did not match',
        code: 401,
        message: 'Unauthorised',
      },
    });
  }
});

// Routes with different versions
const v1Router = require('./src/v1/v1Routes');
const v2Router = require('./src/v2/v2Routes');

app.use('/v1', v1Router);
app.use('/v2', v2Router);

// Listen and default response
app.listen(port, () => {
  console.log(`Gateway listening on port ${port}`);
});

app.use((req, res) => {
  res.status(404).send({
    error: {
      description: 'Couldn\'t find the requested resource \'' + req.originalUrl + '\'',
      code: 404,
      message: 'Not Found',
    },
  });
});
