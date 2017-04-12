import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import mongoose from 'mongoose';
import Database from './persistence/db';
import api from './routes/api';
import config from './config/main';

const app = express();
app.server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new Database();
mongoose.Promise = Promise;
mongoose.connect(config.database.uri);

app.use('/', express.static('public'));
app.use('/api/', api({ db }));

app.server.listen(process.env.PORT || config.server.port);
console.log(`Server listening on port ${app.server.address().port}...`);

export default app;
