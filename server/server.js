const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser')
require('dotenv').config();
const apiRouter = require('./api');

const { sessionSecret } = process.env;

const port = 5000;

/**
 * Proxy Server listening on localhost:5000
 * http://localhost:3000 sends request, it hits localhost:5000. 
 */

const app = express();

app.use(bodyParser.json());

app.use(cookieSession({
    name: 'tinderMusic',
    secret: sessionSecret,
    maxAge: 24 * 60 * 60 * 1000
  })
);

app.use(apiRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});