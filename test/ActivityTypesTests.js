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
    testData.adminToken = jwt.sign({ username: 'admin', isAdmin: true });
    done();
  });
}

describe('ActivityTypes', () => {
  before(seed); 

  describe('POST /activity-types', () => {
    it('should create an activityType', (done) =>{      
      chai.request(app)
		    .post(`/api/activity-types`)
        .send({
            name: "paintBall",
            description: "shoot each other with paint"
        })
        .set('x-auth-token', testData.adminToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('object');
			  	expect(res.body.data.name).to.exist;
			  	expect(res.body.data.description).to.exist;
			  	expect(res.body.data.isConfirmed).to.be.true;

          testData.activityType = res.body.data;
          
		      done();
      });
    });

    it('should ensure only an admin can create activityTypes ', (done) =>{      
      chai.request(app)
		    .post(`/api/activity-types`)
        .send({
            name: "paintBall",
            description: "shoot each other with paint"
        })
        .set('x-auth-token', testData.clientToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.NOT_ADMIN.message);
          
		      done();
      });

    });
    
  });

  describe('GET /activity-types', () => {
    it('should return all activity types', (done) =>{      
      chai.request(app)
		    .get(`/api/activity-types`)
        .set('x-auth-token', testData.clientToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('array');
			  	expect(res.body.data.length).to.equal(1);
          
		      done();
      });
    });
    
  });
  
  describe('GET /activity-types/:id', () => {
    
    it('should return activity type with certain Id', (done) =>{      
      chai.request(app)
		    .get(`/api/activity-types/${testData.activityType._id}`)
        .set('x-auth-token', testData.clientToken)
		    .end((err, res) => {
			
        	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('object');
			  	expect(res.body.data.name).to.equal(testData.activityType.name);
          
		      done();
      });

    });
  
  });

  describe('PUT /activity-types/:id', () => {
    
    it('should update activity type with a certain Id', (done) =>{      
      chai.request(app)
		    .put(`/api/activity-types/${testData.activityType._id}`)
        .set('x-auth-token', testData.adminToken)
        .send({
          isConfirmed:false
        })
		    .end((err, res) => {
			
        	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('object');
			  	expect(res.body.data.isConfirmed).to.equal(false);
          
		      done();
      });

    });
    
  });
  
  describe('DELETE /activity-types/:id', () => {
    
    it('should delete activity type with a certain Id', (done) =>{      
      chai.request(app)
		    .delete(`/api/activity-types/${testData.activityType._id}`)
        .set('x-auth-token', testData.adminToken)
		    .end((err, res) => {
			
        	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.null;
          
		      done();
      });

    });
    
  });
  
  describe('POST /activity-types/addition-requests', () => {
    it('should create an activityTypeRequest', (done) =>{      
      chai.request(app)
		    .post(`/api/activity-types/addition-requests`)
        .send({
            name: "paintBall",
            description: "shoot each other with paint"
        })
        .set('x-auth-token', testData.clientToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('object');
			  	expect(res.body.data.name).to.exist;
			  	expect(res.body.data.description).to.exist;
			  	expect(res.body.data.isConfirmed).to.be.false;

          testData.activityType = res.body.data;
          
		      done();
      });
    });
  });

  describe('GET /activity-types/addition-requests', () => {
    it('should return all activity types requests', (done) =>{      
      chai.request(app)
		    .get(`/api/activity-types/addition-requests`)
        .set('x-auth-token', testData.adminToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('array');
			  	expect(res.body.data.length).to.equal(1);
			  	expect(res.body.data[0].isConfirmed).to.equal(false);
          
		      done();
      });
    });
    
  });
  
  describe('PUT /activity-types/addition-requests/:id/verify', () => {
    it('should update activity types request with a certain Id', (done) =>{      
      chai.request(app)
		    .put(`/api/activity-types/addition-requests/${testData.activityType._id}/verify`)
        .set('x-auth-token', testData.adminToken)
		    .end((err, res) => {
			  	
          expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('object');
			  	expect(res.body.data.isConfirmed).to.equal(true);
          
		      done();
      });
    });
    
  });


});
