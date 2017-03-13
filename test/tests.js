const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const Database = require('../src/persistence/db');
const config = require('../src/config/main.json');
const businesses = require('./examples/businesses.json');

const expect = chai.expect;
chai.use(chaiAsPromised);

const db = new Database(config.database);

const beforeEachHook = () => db.drop();

describe('Database', () => {

  /** Initialization */

  describe('Initialization', () => {
    it('should connect', () => {
      return expect(db.connect())
        .to.eventually.not.be.empty;
    });
  });

  /** Businesses */

  describe('Businesses', () => {
    beforeEach(beforeEachHook);

    it('should insert one business', () => {
      return Promise.resolve()
        .then(() => expect(db.getBusinessesCount())
          .to.eventually.equal(0))
        .then(() => expect(db.insertOneBusiness(businesses[0]))
          .to.eventually.deep.equal(businesses[0]))
        .then(() => expect(db.getBusinessesCount())
          .to.eventually.equal(1));
    });

    it('should insert businesses', () => {
      return Promise.resolve()
        .then(() => expect(db.getBusinessesCount())
          .to.eventually.equal(0))
        .then(() => expect(db.insertBusinesses(businesses))
          .to.eventually.deep.equal(businesses))
        .then(() => expect(db.getBusinessesCount())
          .to.eventually.equal(businesses.length));
    });

    it('should get all businesses', () => {
      return Promise.resolve()
        .then(() => db.insertBusinesses(businesses))
        .then(() => expect(db.getAllBusinesses())
          .to.eventually.deep.equal(businesses));
    });

    it('should search businesses', () => {
      return Promise.resolve()
        .then(() => db.insertBusinesses(businesses))
        .then(() => expect(db.searchBusinesses({ name: 'KFC' }))
          .to.eventually.deep.equal(businesses.filter(({ name }) => name === 'KFC')));
    });

    it('should get one business by _id', () => {
      return Promise.resolve()
        .then(() => db.insertBusinesses(businesses))
        .then(([{ _id }]) => expect(db.getOneBusiness({ _id }))
          .to.eventually.deep.equal(businesses[0]));
    });

    it('should modify one business by _id', () => {
      return Promise.resolve()
        .then(() => db.insertBusinesses(businesses))
        .then(([{ _id }]) => db.modifyOneBusiness({ _id }, { name: 'Hardees' }))
        .then(() => db.getOneBusiness({ _id: businesses[0]._id }))
        .then((business) => {
          expect(business)
            .to.have.property('_id')
            .that.deep.equals(businesses[0]._id);
          expect(business)
            .to.have.property('name')
            .that.not.deep.equals(businesses[0].name);
          expect(business)
            .to.have.property('description')
            .that.deep.equals(businesses[0].description);
        })
        .then(() => expect(db.getBusinessesCount())
          .to.eventually.equal(businesses.length));
    });

    it('should delete business by _id', () => {
      return Promise.resolve()
        .then(() => db.insertBusinesses(businesses))
        .then(([{ _id }]) => db.deleteOneBusiness({ _id }))
        .then(() => expect(db.getBusinessesCount())
          .to.eventually.equal(businesses.length - 1));
    });
  });
});
