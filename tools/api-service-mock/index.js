const path = require('path');
const cors = require('cors');

const express = require('express');
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

app.post('/admin/auth/token', (req, res) => {
  res.status(401).json({
    message: 'Unauthorized',
  });
});

app.use(
  createMockMiddleware({
    file: path.resolve(__dirname, '../../api/openapi.yaml'),
    cors: {
      enable: false,
    },
  })
);

app.listen(port, () => console.log(`Server listening on port ${port}`));
