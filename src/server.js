require('dotenv').config();

const http = require('http');
const app = require('./index');
const port = process.env.PORT;
const server = http.createServer(app);

server.listen(port);

app.use((req, res, next) => {
  return res.jsonBadRequest(null, 'Nenhuma rota encontrada.');
});

module.exports = app;
