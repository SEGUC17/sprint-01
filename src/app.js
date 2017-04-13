import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import morgan from 'morgan';
import Database from './persistence/db';
import api from './routes/api';
import config from './constants/config';

// DUMMY DATA FOR TESTING
import businesses from '../test/examples/businesses.json';
import clients from '../test/examples/clients.json';

const app = express();
app.server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const db = new Database();

db.connect()
  .then(async () => {
    if (config.database.reseed) db.drop();

    const adminsCount = await db.getAdminsCount();
    if (adminsCount === 0) await db.insertOneAdmin(config.masterAdmin);

    // DUMMY DATA FOR TESTING
    await db.insertClients(clients);
    await db.insertBusinesses(businesses);
  })
  .then(() => {
    app.use('/', express.static('public'));
    app.use('/api/', api({ db }));

    app.server.listen(process.env.PORT || config.server.port);
    console.log(`Server listening on port ${app.server.address().port}...`);
  })
  .catch((err) => {
    console.error(err.message);
  });
