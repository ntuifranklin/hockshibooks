import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, before } from 'mocha';
import nodemailerMock from 'nodemailer-mock'; 
import supertest from 'supertest';
import cheerio from 'cheerio';

import { config } from 'dotenv';
import {app} from "../server.js"
import { mock } from 'nodemailer-mock';
config()
const { expect } = chai;

chai.use(chaiHttp);
let server=app;
let csrfToken;

describe('User Authentication and Page Access with OTP', function() {
  this.timeout(60000); 

  before(async function() {
    nodemailerMock.mock.reset();
    process.env.NODE_ENV = 'test';
})

  const validUser = {
    email: 'juniorhoza56@gmail.com',
    password: 'plaintextpassword' 
  };

  let agent = supertest.agent(server);

  let otpCode;
  


  // Test to check that the login route works and returns no error.
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

  
it('should login successfully with correct credentials and OTP',  async (done)=> {
    this.timeout(20000); // Increase timeout for this test

    // Step 1: Login with email and password to trigger OTP
    await agent
      .post(`/admin/`)
      .set('csrf-token', csrfToken)
      .send({ ...validUser, _csrf: csrfToken })
      .end( (err, res) => {
        
        if (err) return done(err);
        expect(res).to.have.status(200);

        const sentEmails =  nodemailerMock.mock.getSentMail();
        console.log(sentEmails)
        expect(sentEmails).to.have.lengthOf(1);
        console.log(sentEmails)

        const email = sentEmails[0];
        expect(email.to).to.equal(validUser.email);

        console.log(sentEmails)

        const emailContent = sentEmails[0].text;
        if (!emailContent) {
          return done(new Error('Email content is undefined'));
        }

        otpCode = emailContent.match(/\d{6}/);
        if (!otpCode) {
          return done(new Error('OTP code not found in email'));
        }
        otpCode = otpCode[0]; // Extract the first match, which is the OTP code

        // Step 2: Verify OTP
        agent
          .post('/admin/verifyOtp') // Ensure this path matches your actual OTP verification route
          .send({ userId: res.body.userId, OTP: otpCode })
          .end((err, res) => {
            if (err) return done(err);
            expect(res).to.have.status(200);
            expect(res).to.have.cookie('connect.sid'); // Ensure the session cookie is set
            done();
          });
      });
  });


  it('should allow a logged-in user to view items on the page', function(done) {
    this.timeout(10000); 
    agent
      .get(`/admin/dashboard`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array'); 
        done();
      });
  });
});
