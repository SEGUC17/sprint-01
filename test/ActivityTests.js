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


const seed = (done) => {
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
  before(seed); 

  describe('GET /activities', () => {
    it('should return correct data', (done) =>{      
      chai.request(app)
		    .get(`/api/activities`)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('array');
			  	expect(res.body.data).to.be.of.length(1);
		      done();
      });

    });

  });
  
  describe('GET /activities/search', () => {
    it('should return correct data if a correct name was used', (done) =>{
      chai.request(app)
		    .get(`/api/activities/search?name=testactivity`)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('array');
			  	expect(res.body.data).to.be.of.length(1);
			  	expect(res.body.data[0]._id).to.equal(testData.activityDoc._id.toString());
		      done();
      });

    });
    
    it('should return correct data if a part of the name was used', (done) =>{
      chai.request(app)
		    .get(`/api/activities/search?name=st`)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('array');
			  	expect(res.body.data).to.be.of.length(1);
			  	expect(res.body.data[0]._id).to.equal(testData.activityDoc._id.toString());
		      done();
      });

    });

    it('should return empty data if no matching names in activites', (done) =>{
      chai.request(app)
		    .get(`/api/activities/search?name=xyz`)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('array');
			  	expect(res.body.data).to.be.of.length(0);
		      done();
      });

    });
  });

  describe('GET /activities/:id', () => {
    it('should return correct data if activity exists', (done) =>{  

      chai.request(app)
		    .get(`/api/activities/${testData.activityDoc._id}`)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('object');
			  	expect(res.body.data).to.be.not.empty;
		      done();
      });

    });
    
    it('should return null object if no activity found with that id', (done) =>{  

      chai.request(app)
		    .get(`/api/activities/${testData.userDoc._id}`)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
          expect(res.body.data).to.be.null;
		      done();
      });

    });

  });

  describe('POST /activities', () => {
    it('should verify token', (done) =>{  
      chai.request(app)
		    .post(`/api/activities`)
		    .end((err, res) => {
			  	expect(res).to.have.status(401);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.invalidToken.message);
		      done();
      });

    });
    
    it('should ensure that the issuer role is business', (done) =>{  
      chai.request(app)
		    .post(`/api/activities`)
        .set('x-auth-token', testData.clientToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.notBusiness.message);
		      done();
      });

    });
    
    it('should create activity with minimal data', (done) =>{  

      chai.request(app)
		    .post(`/api/activities`)
        .set('x-auth-token', testData.businessToken)
        .send({
          name: 'testActivity2',
          activityType: testData.activityDoc.activityType,
        })
		    .end((err, res) => {
			  	expect(res).to.have.status(201);
			  	expect(res.body.error).to.be.null;
          expect(res.body.data).to.not.be.empty;
          
		      done();
      });

    });
  });

  

});
