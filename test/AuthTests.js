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

    
    testData.clientToken = jwt.sign({ username: 'client', isAdmin: false });
    testData.adminToken = jwt.sign({ username: 'admin', isAdmin: true });
    
    done();
  })
}

describe('User', () => {
  before(seed); 

  describe('POST /signup', () => {
    
    it('should create a new user', (done) =>{      
      chai.request(app)
		    .post(`/api/signup`)
        .send( _.omit(clientExamples[0], '_id') )
		    .end((err, res) => {
			  	expect(res).to.have.status(201);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('object');
			  	expect(res.body.data.username).to.equal(clientExamples[0].username);
			  	expect(res.body.data.password).to.equal(undefined);
		      done();
      });

    });
    
    it('should return 400 if user data is missing', (done) =>{      
      chai.request(app)
		    .post(`/api/signup`)
        .send( _.omit(clientExamples[0], ['_id', 'username']) )
		    .end((err, res) => {
			  	expect(res).to.have.status(400);
			  	expect(res.body.data).to.be.null;
		      done();
      });

    });

  });
  
  describe('POST /admins', () => {
    
    it('should create a new admin', (done) =>{      
      chai.request(app)
		    .post(`/api/admins`)
        .send( _.omit(clientExamples[1], '_id'))
        .set('x-auth-token', testData.adminToken)
		    .end((err, res) => {
			  	expect(res).to.have.status(201);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.an('object');
			  	expect(res.body.data.username).to.equal(clientExamples[1].username);
			  	expect(res.body.data.password).to.equal(undefined);
		      done();
      });

    });
    
    it('should return 400 if user data is missing', (done) =>{      
      chai.request(app)
		    .post(`/api/admins`)
        .send( _.omit(clientExamples[0], ['_id', 'username']) )
        .set('x-auth-token', testData.adminToken)		    
        .end((err, res) => {
			  	expect(res).to.have.status(400);
			  	expect(res.body.data).to.be.null;
		      done();
      });

    });
    
    it('should return 403 if the issues is not an admin', (done) =>{      
      chai.request(app)
		    .post(`/api/admins`)
        .send( _.omit(clientExamples[0], ['_id', 'username']) )
        .set('x-auth-token', testData.clientToken)		    
		    .end((err, res) => {
			  	expect(res).to.have.status(403);
			  	expect(res.body.error).to.equal(errors.NOT_ADMIN.message);
			  	expect(res.body.data).to.be.null;
		      done();
      });

    });

  });

  describe('POST /login', () => {
    
    it('should return a valid token', (done) =>{      
      chai.request(app)
		    .post(`/api/login`)
        .send( _.pick(clientExamples[1], ['username', 'password']))
		    .end((err, res) => {
			  	expect(res).to.have.status(200);
			  	expect(res.body.error).to.be.null;
			  	expect(res.body.data).to.be.a('string');
        })
        done();
      });

    
    it('should return 404 if username not found', (done) =>{      
      chai.request(app)
		    .post(`/api/login`)
        .send({
          username:'fakeUserName',
          password: clientExamples[1].password
        })
        .end((err, res) => {
			  	expect(res).to.have.status(404);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.USER_NOT_FOUND.message);
		      done();
      });

    });
    
    it('should return 404 if password is incorrect', (done) =>{      
      chai.request(app)
		    .post(`/api/login`)
        .send({
          username:clientExamples[1].username,
          password: 'fakePassword'
        })
        .end((err, res) => {
			  	expect(res).to.have.status(404);
			  	expect(res.body.data).to.be.null;
			  	expect(res.body.error).to.equal(errors.PASSWORD_MISMATCH.message);
		      done();
      });

    });
    

  });

  

});

