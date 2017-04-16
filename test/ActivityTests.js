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

describe('Activity', () => {
  before(seed); 

  describe('GET /activities', () => {
    it('should return all activities', (done) =>{      
      chai.request(app)
		    .get(`/api/activities`)
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
  
  describe('GET /activities/search', () => {
    it('should return matching activities if a correct name was used', (done) =>{
      chai.request(app)
		    .get(`/api/activities/search?name=testactivity`)		    
        .set('x-auth-token', testData.clientToken)
        .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('array');
			  	expect(res.body.data).to.be.of.length(1);
			  	expect(res.body.data[0]._id).to.equal(testData.activityDoc._id.toString());
		      done();
      });

    });
    
    it('should return matching activities if a part of the name was used', (done) =>{
      chai.request(app)
		    .get(`/api/activities/search?name=st`)
        .set('x-auth-token', testData.clientToken)        
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('array');
			  	expect(res.body.data).to.be.of.length(1);
			  	expect(res.body.data[0]._id).to.equal(testData.activityDoc._id.toString());
		      done();
      });

    });

    it('should return empty array if no matching names in activities', (done) =>{
      chai.request(app)
		    .get(`/api/activities/search?name=xyz`)
        .set('x-auth-token', testData.clientToken)        
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
    it('should return activity with certain Id', (done) =>{  

      chai.request(app)
		    .get(`/api/activities/${testData.activityDoc._id}`)
        .set('x-auth-token', testData.clientToken)        
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('object');
			  	expect(res.body.data).to.be.not.empty;
		      done();
      });

    });
    
    it('should return 404 if no activity found with that id', (done) =>{  

      chai.request(app)
		    .get(`/api/activities/${testData.userDoc._id}`)
        .set('x-auth-token', testData.clientToken)        
		    .end((err, res) => {
			  	expect(res).to.have.status(404);
          expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.ACTIVITY_NOT_FOUND.message);
		      done();
      });

    });

  });

  describe('POST /activities', () => {
    
    it('should create activity', (done) =>{  
      chai.request(app)
		    .post(`/api/activities`)
        .set('x-auth-token', testData.businessToken)
        .send({ 
          name: 'testActivity2',
          isConfirmed: true,
          activityType: testData.activityDoc.activityType
        })
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data.name).to.equal("testActivity2");
          
          testData.activityDoc = res.body.data;
		      
          done();
      });

    });
    
    it('should verify token', (done) =>{  
      chai.request(app)
		    .post(`/api/activities`)
		    .end((err, res) => {
			  	expect(res).to.have.status(401);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.INVALID_TOKEN.message);
          
		      
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
			  	expect(res.body.error).to.equal(errors.NOT_BUSINESS.message);
		      done();
      });

    });
    
  });

  describe('PUT /activities/:id', () => {

    it('should uupdate activity with certain Id', (done) =>{  
      chai.request(app)
		    .put(`/api/activities/${testData.activityDoc._id}`)
        .set('x-auth-token', testData.businessToken)
        .send({
          name:'testActivity3'
        })
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data.name).to.equal("testActivity3");
		      done();
      });

    });

    it('should ensure that the issuer role is activity owner', (done) =>{  
      chai.request(app)
		    .put(`/api/activities/${testData.activityDoc._id}`)
        .set('x-auth-token', testData.clientToken)
        .send({
          name:'testActivity3'
        })
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.UNRIGHTFUL_ACTIVITY_OWNER.message);
		      done();
      });

    });
    
  });
  
  describe('DELETE /activities/:id', () => {
    
    it('should ensure that the issuer role is activity owner', (done) =>{  
      chai.request(app)
		    .delete(`/api/activities/${testData.activityDoc._id}`)
        .set('x-auth-token', testData.clientToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.UNRIGHTFUL_ACTIVITY_OWNER.message);
		      done();
      });

    });
    
    it('should delete document bookings', (done) =>{  
      chai.request(app)
		    .delete(`/api/activities/${testData.activityDoc._id}`)
        .set('x-auth-token', testData.businessToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.null;
		      done();
          
      });

    });
    
  });

  

});

