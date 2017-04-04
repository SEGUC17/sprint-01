import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import Database from '../src/persistence/db';
import config from '../src/config/main';
import businesses from './examples/businesses.json';

const expect = chai.expect;
chai.use(chaiAsPromised);

const db = new Database(config.database);
const beforeEachHook = () => db.drop();

describe('Database', () => {
  /** Initialization */

  describe('Initialization', () => {
    it('should connect', () =>
      expect(db.connect())
        .to.eventually.not.be.empty);
  });

  /** Businesses */

  describe('Businesses', () => {
    beforeEach(beforeEachHook);

    it('should insert one business', () =>
      Promise.resolve()
        .then(() => expect(db.insertOneBusiness(businesses[0]))
          .to.eventually.deep.equal(businesses[0])));

    it('should insert all businesses', () =>
      Promise.resolve()
        .then(() => expect(db.insertBusinesses(businesses))
          .to.eventually.deep.equal(businesses)));

    it('should get all businesses', () =>
      Promise.resolve()
        .then(() => db.insertBusinesses(businesses))
        .then(() => expect(db.getAllBusinesses())
          .to.eventually.deep.equal(businesses)));

    it('should count all businesses', () =>
      Promise.resolve()
        .then(() => db.insertBusinesses(businesses))
        .then(() => expect(db.getBusinessesCount())
          .to.eventually.equal(businesses.length)));

    it('should search all businesses', () =>
      Promise.resolve()
        .then(() => db.insertBusinesses(businesses))
        .then(() => expect(db.searchBusinesses({ name: businesses[0].name }))
          .to.eventually.deep.equal(businesses.filter(({ name }) => name === businesses[0].name))));

    it('should get one business by _id', () =>
      Promise.resolve()
        .then(() => db.insertBusinesses(businesses))
        .then(([{ _id }]) => expect(db.getOneBusiness({ _id }))
          .to.eventually.deep.equal(businesses[0])));

    it('should modify one business by _id', () =>
      Promise.resolve()
        .then(() => db.insertBusinesses(businesses))
        .then(([{ _id }]) => db.modifyOneBusiness({ _id }, { name: 'Drumpf' }))
        .then((data) => {
          expect(data)
            .to.have.property('_id')
            .that.deep.equals(businesses[0]._id);
          expect(data)
            .to.have.property('name')
            .that.not.deep.equals(businesses[0].name);
          expect(data)
            .to.have.property('description')
            .that.deep.equals(businesses[0].description);
        }));

    it('should delete one business by _id', () =>
      Promise.resolve()
        .then(() => db.insertBusinesses(businesses))
        .then(([{ _id }]) => expect(db.deleteOneBusiness({ _id }))
          .to.eventually.deep.equal(businesses[0])));
  });
});
