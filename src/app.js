import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import Database from './persistence/db';
import api from './routes/api';
import config from './config/main';
import mongoose from 'mongoose';

mongoose.Promise = Promise;

const app = express();
app.server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new Database();

mongoose.connect(config.database.uri);

app.use('/', express.static('public'));
app.use('/api/', api({ db }));

app.server.listen(process.env.PORT || config.server.port);
console.log(`Server listening on port ${app.server.address().port}...`);
