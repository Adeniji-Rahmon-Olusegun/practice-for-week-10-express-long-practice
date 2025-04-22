const path = require('path');
const express = require('express');
const app = express();
const dogs = require('./routes/dogs');
const { process_params } = require('express/lib/router');

//require('dotenv').config();
require('express-async-errors');

const logger = function(req, res, next) {
  res.on('finish', () => {
    console.log(`${req.method} ${req.url} - ${res.statusCode}`);
  });
  
  next();
}

app.use(logger);
app.use(express.json());
app.use('/dogs', dogs);
app.use('/static', express.static(path.join(__dirname, 'assets')));



// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.status(201);
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!");
});

app.use((req, res, next) => {
  const error = new Error("The requested resource couldn't be found");
  error.status = 404;
  next(error);
})

app.use((err, req, res, next) => {
  
  const errStatus = err.statusCode || 500

  res.status(errStatus);

  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") err.stack = undefined;

  res.json({
    message: err.message,
    status_code: errStatus,
    stack: err.stack
  });
});

const port = process.env.PORT;
app.listen(port, () => console.log('Server is listening on port', port));