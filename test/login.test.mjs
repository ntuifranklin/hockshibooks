
import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, before } from 'mocha';
import nodemailerMock from 'nodemailer-mock';
import supertest from 'supertest';
import cheerio from 'cheerio';
import { config } from 'dotenv';
import {app} from "../server.js"
import { generateAndSendOTP } from '../utilities/functions.js';



config()
const { expect } = chai;

chai.use(chaiHttp);
let server=app;
let csrfToken;

process.env.NODE_ENV = 'test';

let agent = supertest.agent(server);

describe('User Authentication and Page Access with OTP', function() {
  this.timeout(60000); 

  before(async function() {
    nodemailerMock.mock.reset();

    
    })
   

  const validUser = {
    userId:"e574b34f-2ef7-11ef-8f1f-0242ac110002",
    email: 'juniorhoza56@gmail.com',
    password: 'plaintextpassword' 
  };


  let otpCode;
  


  it('should return 200 OK for the login route', (done) =>{

    this.timeout(10000); // Increase timeout for this test
    agent
      .get("/admin/") 

      .end((err, res, body) => {
        if (err) return done(err);
        
        console.log(validUser)
        const $= cheerio.load(res.text)
        csrfToken = $('input[name=_csrf]').val();
        expect(csrfToken).to.exist;
        expect(res).to.have.status(200);
        done();
      });
  });

  
  it('should login successfully with correct credentials and OTP', async () => {
    let res;
    try {
      res = await agent
        .post(`/admin/`)
        .set('csrf-token', csrfToken)        
        .send({ ...validUser, _csrf: csrfToken });

      expect(res).to.have.status(200);

      const emailResult = await generateAndSendOTP(validUser.userId, validUser.email);

      // Extract OTP code from the email result (in test environment, the OTP is stored in process.env.TestCode)
      otpCode = emailResult;
      if (!otpCode) {
        throw new Error('OTP code not found in email');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }

    // Step 2: Verify OTP
    try {
      res = await agent
        .post('/admin/verifyOtp')
        .set('csrf-token', csrfToken)
        .send({ userId: validUser.userId, OTP: otpCode,_csrf: csrfToken });

      expect(res).to.have.cookie('connect.sid'); 
      // Ensure the session cookie is set
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  it('should allow a logged-in user to view items on the page', async ()=> {
  
    agent
      .get(`/admin/dashboard`)

      .end((err, res) => {
        if (err) return done(err);
        
        expect(res).to.have.status(200);
        done();
      });
  });

});


  
