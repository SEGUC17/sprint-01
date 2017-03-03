const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const Database = require('./persistence/db');
const api = require('./routes/api');
const config = require('./config/main.json');

const app = express();
app.server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new Database(config.database);

db.connect()
  .then(() => {
    if (config.database.reseed) db.drop();
  })
  .then(() => {
    app.use('/', express.static('public'));
    app.use('/api/', api({ db }));

    app.server.listen(process.env.PORT || config.server.port);
    console.log(`Server listening on port ${app.server.address().port}...`);
  })
  .catch((err) => {
    throw err;
  });
