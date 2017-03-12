const expect = require('chai').expect;

const Database = require('../src/persistence/db');
const config = require('../src/config/main.json');

const db = new Database(config.database);

describe('Database', () => {
  describe('Initialization', () => {
    it('should connect', () => {
      return db.connect().then(({ db }) => {
        expect(db).to.not.be.empty;
      });
    });
  });
});
