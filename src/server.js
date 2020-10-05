const http = require('http');
const app = require('./index');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const morgan = require('morgan');
const bodyParser = require('body-parser');

require('dotenv').config();

server.listen(port);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); // apenas dados simples
app.use(bodyParser.json()); // json de entrada no body

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // no lugar de *, poderia ser um servidor especifico https://meusite.com.br
  res.header(
    'Acces-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  if (req.method === 'OPTIONS' || req.method === 'options') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');

    return res.status(200).send({});
  }

  next();
});

app.use('/', (req, res) => {
  res.send({ message: `API's running at ${port}` });
});
/*
app.use((req, res, next) => {
  const error = new Error('Nenhuma rota encontrada.');
  error.status = 400;

  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);

  return res.send({
    error: error.message,
  });
});
*/
module.exports = app;
