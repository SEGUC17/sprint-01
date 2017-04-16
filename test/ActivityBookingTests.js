import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';

import Database from '../src/persistence/db';
import config from '../src/constants/config';
import businesses from './examples/businesses.json';

import jwt from '../src/auth/jwt';
import mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
import _ from 'lodash'

import app from '../src/app';

import Activity from '../src/persistence/models/activity';
import ActivityType from '../src/persistence/models/activityType';
import User from '../src/persistence/models/user';
import Business from '../src/persistence/models/business';
import errors from '../src/constants/errors';

import clientExamples from './examples/clients.json';
import businessExamples from './examples/businesses.json';


const expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(chaiHttp);



//shall contain all persistend data to check against
let testData = {};


const seed = (done) => {
  mongoose.connection.dropDatabase(error => {
    if(error){
      process.exit(0);
    }

    testData.userDoc = _.omit(clientExamples[0],'_id');
    testData.businessUserDoc = _.omit(clientExamples[1],'_id');
    
    testData.clientToken = jwt.sign(testData.userDoc);
    testData.businessToken = jwt.sign(testData.businessUserDoc);
    testData.adminToken = jwt.sign({ username: 'admin', role: 'ADMIN' });

    testData.ActivityTypeDoc = {
      name: "paintBall",
      isConfirmed: true,
    }

    testData.activityDoc = { 
      name: 'testActivity',
      isConfirmed: true,
    }
    
    testData.businessDoc = _.omit(businessExamples[0],'_id');
    
    new User(testData.userDoc).save()
    .then((user)=>{
      testData.userDoc = user;
      testData.activityDoc.bookings = [{client:user._id, isConfirmed:true}];
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
      testData.businessDoc.activities = [activity._id];
      testData.businessDoc.isVerified = true;
      return new Business(testData.businessDoc).save(); 
    })
    .then((business)=>{
      testData.businessDoc = business;
      done();
    })
    .catch((err)=>{
      console.log(err.message);
    })

  });
}
describe('ActivityBooking', () => {
  before(seed); 

  describe('GET /activities/:id/bookings', () => {
    it('should return correct data', (done) =>{      
      chai.request(app)
		    .get(`/api/activities/${testData.activityDoc._id}/bookings`)
        .set('x-auth-token', testData.businessToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('array');
			  	expect(res.body.data).to.be.of.length(1);
		      done();
      });

    });
    
    it('should return 404 if activity is not found', (done) =>{      
      chai.request(app)
		    .get(`/api/activities/${ObjectId()}/bookings`)
        .set('x-auth-token', testData.businessToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(404);
			  	expect(res.body.error).to.equal(errors.ACTIVITY_NOT_FOUND.message);
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

     it('should return 404 if activity is not found', (done) =>{      
      chai.request(app)
		    .get(`/api/activities/${ObjectId()}/bookings/${testData.activityDoc.bookings[0]._id}`)
        .set('x-auth-token', testData.businessToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(404);
			  	expect(res.body.error).to.equal(errors.ACTIVITY_NOT_FOUND.message);
		      done();
      });

    });

     it('should return 404 if booking is not found', (done) =>{      
      chai.request(app)
		    .get(`/api/activities/${testData.activityDoc._id}/bookings/${ObjectId()}`)
        .set('x-auth-token', testData.businessToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(404);
			  	expect(res.body.error).to.equal(errors.BOOKING_NOT_FOUND.message);
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
          isConfirmed: false
        })
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data.isConfirmed).to.be.false;
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
			  	expect(res.body.error).to.equal(errors.INVALID_TOKEN.message);
		      done();
      });
    });

    it('should ensure that the issuer is the business owner', (done) =>{
      chai.request(app)
		    .put(`/api/activities/${testData.activityDoc._id}/bookings/${testData.activityDoc.bookings[0]._id}`)
        .set('x-auth-token', testData.clientToken)
        .send({
          isConfirmed: true
        })
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.UNRIGHTFUL_ACTIVITY_OWNER.message);
		      done();
          
      });
    });

  });

  describe('DELETE /activities/:activityId/bookings/:bookingId', () => {
    it('should delete the right booking', (done) =>{
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
			  	expect(res.body.error).to.equal(errors.INVALID_TOKEN.message);
		      done();
      });
    });

    it('should ensure that the issuer is the business owner', (done) =>{
      chai.request(app)
		    .delete(`/api/activities/${testData.activityDoc._id}/bookings/${testData.activityDoc.bookings[0]._id}`)
        .set('x-auth-token', jwt.sign({username:testData.userDoc.username, role:'BUSINESS'}))
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.UNRIGHTFUL_ACTIVITY_OWNER.message);
		      done();
      });
    });

  });

  
  describe('POST /activities/:activityId/booking-requests', () => {
    it('should create new booking request', (done) =>{      
      chai.request(app)
		    .post(`/api/activities/${testData.activityDoc._id}/booking-requests`)
        .set('x-auth-token', testData.clientToken)
        .send({
          client:testData.userDoc._id
        })
		    .end((err, res) => {
          testData.bookingRequestId =  res.body.data._id;
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('object');
			  	expect(res.body.data.isConfirmed).to.be.false;
			  	expect(res.body.data.client).to.equal(testData.userDoc._id.toString());
		      done();
      });

    }); 
  }); 
  
  describe('GET /activities/:id/booking-requests', () => {
    it('should return correct booking request', (done) =>{      
      chai.request(app)
		    .get(`/api/activities/${testData.activityDoc._id}/booking-requests`)
        .set('x-auth-token', testData.clientToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('array');
			  	expect(res.body.data).to.be.of.length(1);
		      done();
      });

    }); 
  }); 
  
  describe('PUT /activities/:activityId/booking-requests/:bookingId/verify', () => {
    it('should update the booking request', (done) =>{      
      chai.request(app)
		    .put(`/api/activities/${testData.activityDoc._id}/booking-requests/${testData.bookingRequestId}/verify`)
        .set('x-auth-token', testData.businessToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('object');
			  	expect(res.body.data.isConfirmed).to.be.true;
		      done();
      });

    }); 
    
    it('should ensure that the issuer is the business owner', (done) =>{
      chai.request(app)
		    .put(`/api/activities/${testData.activityDoc._id}/booking-requests/${testData.bookingRequestId}/verify`)
        .set('x-auth-token', testData.clientToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.UNRIGHTFUL_ACTIVITY_OWNER.message);
		      done();
          
      });
    });

  }); 
  
  describe('DELETE /activities/:activityId/booking-requests/:bookingId/verify', () => {
    it('should delete booking', (done) =>{      
      chai.request(app)
		    .delete(`/api/activities/${testData.activityDoc._id}/booking-requests/${testData.bookingRequestId}/verify`)
        .set('x-auth-token', testData.businessToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.null;
		      done();
      });
    });

    it('should ensure that the issuer is the business owner', (done) =>{
      chai.request(app)
		    .delete(`/api/activities/${testData.activityDoc._id}/booking-requests/${testData.bookingRequestId}/verify`)
        .set('x-auth-token', testData.clientToken)
        .send({
          isConfirmed: true
        })
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.UNRIGHTFUL_ACTIVITY_OWNER.message);
		      done();
          
      });
    });

  }); 



});
