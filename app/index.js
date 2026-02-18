const client = require('prom-client');
const express = require('express');
const app = express();

const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Métrica: total de requests
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestsTotal);

// Métrica: duração das requisições
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5]
});

register.registerMetric(httpRequestDuration);

// Middleware para medir
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });

    end({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });
  });

  next();
});

// Endpoint de métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/', (req, res) => {
  res.send('AWS lab running 🚀');
});

app.get('/boom', (req, res) => res.status(500).send('boom'));

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
