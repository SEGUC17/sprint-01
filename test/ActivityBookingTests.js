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
import Business from '../src/persistence/models/business';
import errors from '../src/validation/errors';

const expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(chaiHttp);



//shall contain all persistend data to check against
let testData = {};


<<<<<<< HEAD
const seed = (done) => {
=======
const beforeEachHook = (done) => {
>>>>>>> 36bb3f044b221b5eeae0dfdfa825d3e7e4678825
  mongoose.connection.dropDatabase(error => {
    if(error){
      console.log('Error', error);
      process.exit(0);
    }


    testData.userDoc = {
      username: 'userTester',
      email: 'tester@test.test',
      role: "CLIENT",
    };
    testData.businessUserDoc = {
      username: 'businessTester',
      email: 'tester@test.test',
      role: "BUSINESS",
    };

    testData.clientToken = jwt.sign(testData.userDoc);
    testData.businessToken = jwt.sign(testData.businessUserDoc);
    testData.adminToken = jwt.sign({ username: 'admin', role: 'ADMIN' });

    testData.ActivityTypeDoc = {
      name: "paintBall",
      isConfirmed: true,
    }

    testData.activityDoc = { 
      name: 'testActivity',
<<<<<<< HEAD
=======
      email: 'tester@test.test',
>>>>>>> 36bb3f044b221b5eeae0dfdfa825d3e7e4678825
      isConfirmed: "true",
    }
    
    testData.businessDoc = { 
      name: 'breakout',
    }
    
    new User(testData.userDoc).save()
    .then((user)=>{
      testData.userDoc = user;
      testData.activityDoc.bookings = [{client:user._id}];
      return new User(testData.businessUserDoc).save();
    })
    .then((businessUser)=>{
      testData.businessUserDoc = businessUser;
      testData.businessDoc.owner = businessUser._id;
      
      return new ActivityType(testData.ActivityTypeDoc).save();  
    })
    .then((activityType)=>{
      testData.activityDoc.activityType = activityType._id;

      return new Activity(testData.activityDoc).save(); 
    })
    .then((activity)=>{
      testData.activityDoc = activity;
      testData.businessDoc.activites = [activity._id];
      
      return new Business(testData.businessDoc).save(); 
    })
    .then((business)=>{
      testData.businessDoc = business;
      done();
    })

  });
}
describe('ActivityBooking', () => {
<<<<<<< HEAD
  before(seed); 
=======
  before(beforeEachHook); 
>>>>>>> 36bb3f044b221b5eeae0dfdfa825d3e7e4678825

  describe('GET /activities/:id/bookings', () => {
    it('should return correct data', (done) =>{      
      chai.request(app)
		    .get(`/api/activities/${testData.activityDoc._id}/bookings`)
        .set('x-auth-token', testData.businessToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
<<<<<<< HEAD
			  	expect(res.body.data).to.be.an('array');
=======
			  	expect(res.body.data).to.be.a('array');
>>>>>>> 36bb3f044b221b5eeae0dfdfa825d3e7e4678825
			  	expect(res.body.data).to.be.of.length(1);
		      done();
      });

    });

  });
  
  describe('GET /activities/:id/bookings/:bookingId', () => {
    it('should return correct data', (done) =>{
      chai.request(app)
		    .get(`/api/activities/${testData.activityDoc._id}/bookings/${testData.activityDoc.bookings[0]._id}`)
        .set('x-auth-token', testData.businessToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('object');
			  	expect(res.body.data.client).to.equal(testData.userDoc._id.toString());
		      done();
      });

    });

  });
  
  describe('PUT /activities/:activityId/bookings/:bookingId', () => {
    it('should modify one document', (done) =>{
      chai.request(app)
		    .put(`/api/activities/${testData.activityDoc._id}/bookings/${testData.activityDoc.bookings[0]._id}`)
        .set('x-auth-token', testData.businessToken)
        .send({
          isConfirmed: true
        })
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data.nModified).to.equal(1);
		      done();
      });

    });

    it('should verify token', (done) =>{
      chai.request(app)
		    .put(`/api/activities/${testData.activityDoc._id}/bookings/${testData.activityDoc.bookings[0]._id}`)
        .send({
          isConfirmed: true
        })
		    .end((err, res) => {
			  	expect(res).to.have.status(401);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.invalidToken.message);
		      done();
      });
    });

    it('should ensure that the issuer role is business', (done) =>{
      chai.request(app)
		    .put(`/api/activities/${testData.activityDoc._id}/bookings/${testData.activityDoc.bookings[0]._id}`)
        .set('x-auth-token', testData.clientToken)
        .send({
          isConfirmed: true
        })
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.notBusiness.message);
		      done();
      });
    });
    
    it('should ensure that the issuer is the business owner', (done) =>{
      chai.request(app)
		    .put(`/api/activities/${testData.activityDoc._id}/bookings/${testData.activityDoc.bookings[0]._id}`)
        .set('x-auth-token', jwt.sign({username:'fakeName', role:'BUSINESS'}))
        .send({
          isConfirmed: true
        })
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.notAuthorized.message);
		      done();
      });
    });

  });

  describe('DELETE /activities/:activityId/bookings/:bookingId', () => {
    it('should delete the right Id', (done) =>{
      chai.request(app)
		    .delete(`/api/activities/${testData.activityDoc._id}/bookings/${testData.activityDoc.bookings[0]._id}`)
        .set('x-auth-token', testData.businessToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.null;
		      done();
      });

    });

    it('should verify token', (done) =>{
      chai.request(app)
		    .delete(`/api/activities/${testData.activityDoc._id}/bookings/${testData.activityDoc.bookings[0]._id}`)
		    .end((err, res) => {
			  	expect(res).to.have.status(401);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.invalidToken.message);
		      done();
      });
    });

    it('should ensure that the issuer role is business', (done) =>{
      chai.request(app)
		    .delete(`/api/activities/${testData.activityDoc._id}/bookings/${testData.activityDoc.bookings[0]._id}`)
        .set('x-auth-token', testData.clientToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.notBusiness.message);
		      done();
      });
    });

    it('should ensure that the issuer is the business owner', (done) =>{
      chai.request(app)
		    .delete(`/api/activities/${testData.activityDoc._id}/bookings/${testData.activityDoc.bookings[0]._id}`)
        .set('x-auth-token', jwt.sign({username:'fakeName', role:'BUSINESS'}))
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.notAuthorized.message);
		      done();
      });
    });

  });

});
