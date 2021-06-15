const path = require('path');

const express = require('express');
const cors = require('cors');
const { createMockMiddleware } = require('openapi-mock-express-middleware');

const port = process.env.APP_PORT || 8004;
const app = express();

app.use(
  cors({
    origin: '*',
    maxAge: 31536000,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  })
);

app.options(
  '*',
  cors({
    origin: '*',
    maxAge: 31536000,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  })
);

app.use(express.json());

app.use(
  createMockMiddleware({
    spec: path.resolve(__dirname, '../../api/openapi.yaml'),
  })
);

app.listen(port, () => console.log(`Server listening on port ${port}`));
