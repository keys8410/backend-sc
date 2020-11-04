require('dotenv').config();

const http = require('http');
const app = require('./index');
const port = process.env.PORT;
const server = http.createServer(app);

server.listen(port);

app.use((req, res, next) => {
  const error = new Error('Nenhuma rota encontrada.');
  error.status = 400;

  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);

  return res.send({
    error: error.message,
  });
});

module.exports = app;
