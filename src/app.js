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
// app.use(morgan('dev'));

const db = new Database();

db.connect()
  .then(() => {
    if (config.database.reseed) db.drop();

    return db.getAdminsCount().
      then((adminsCount)=>{
        if (adminsCount === 0) 
          return db.insertOneAdmin(config.masterAdmin);
        return Promise.resolve()
      })
      .then(()=>{
        // DUMMY DATA FOR TESTING
        // return Promise.all([
        //    db.insertClients(clients),
        //    db.insertBusinesses(businesses)
        // ])
        return Promise.resolve()
      })


   
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

app.use('/api/', api({ db }));
export default app;