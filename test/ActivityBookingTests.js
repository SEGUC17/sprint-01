import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';

import Database from '../src/persistence/db';
import config from '../src/config/main';
import businesses from './examples/businesses.json';

import jwt from '../src/auth/jwt';
import mongoose from 'mongoose';

import app from '../src/app';

import Activity from '../src/persistence/models/activity';
import ActivityType from '../src/persistence/models/activityType';
import User from '../src/persistence/models/user';
import errors from '../src/validation/errors';

const expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(chaiHttp);



//shall contain all persistend data to check against
let testData = {};


const beforeEachHook = (done) => {
  mongoose.connection.dropDatabase(error => {
    if(error){
      console.log('Error', error);
      process.exit(0);
    }

    testData.clientToken = jwt.sign({ username: 'client' , role: 'CLIENT' });
    testData.buissnessToken = jwt.sign({ username: 'buissness', role: 'BUSINESS' });
    testData.adminToken = jwt.sign({ username: 'admin', role: 'ADMIN' });

    testData.buissnessDoc = {
      userName: 'tester',
      email: 'tester@test.test',
      role: "BUSINESS",
    };

    testData.ActivityTypeDoc = {
      name: "paintBall",
      isConfirmed: true,
    }

    testData.ActivityDoc = { 
      name: 'testActivity',
      email: 'tester@test.test',
      isConfirmed: "true",
    }
    
    new User(testData.buissnessDoc).save()
    .then((user)=>{
      testData.buissnessDoc = user;
    });

    new ActivityType(testData.ActivityTypeDoc).save()
    .then((activityType)=>{
      testData.ActivityDoc.activityType = activityType._id;
      
      Activity(testData.ActivityDoc).save()
      .then((activity)=>{
        testData.ActivityDoc = activity;
        done();
      })
      
    });
  });
}
describe('ActivityBooking', () => {
  before(beforeEachHook); 

  describe('/activities/:id/bookings', () => {
    it('should return correct data', (done) =>{
      let x = `/api/activities/${testData.ActivityDoc._id}/bookings`;
      chai.request(app)
		    .get(x)
        .set('x-auth-token', testData.buissnessToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.a('array');
		      done();
      });

    });
    
    it('should verify token', (done) =>{
      let x = `/api/activities/${testData.ActivityDoc._id}/bookings`;
      chai.request(app)
		    .get(x)
		    .end((err, res) => {
			  	expect(res).to.have.status(401);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.invalidToken.message);
		      done();
      });

    });

  });

});
