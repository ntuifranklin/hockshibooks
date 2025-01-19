

import { config } from 'dotenv';
import { env } from 'node:process';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, before } from 'mocha';
import nodemailerMock from 'nodemailer-mock';
import supertest from 'supertest';
import cheerio from 'cheerio';
import adminModel from "../models/otpModel.js"

config();
// Set the environment variable before importing the server

import { app } from "../server.js";
import { generateAndSendOTP } from '../utilities/functions.js';
import { admin } from 'googleapis/build/src/apis/admin/index.js';

const { expect } = chai;

chai.use(chaiHttp);
let server = app;
let csrfToken;
let agent = supertest.agent(server);
const isbn="9781402237126"


describe('User Authentication and Page Access with OTP', function() {
  this.timeout(60000); 

  before(async function() {

    nodemailerMock.mock.reset();
  });

  const validUser = {

    userId:"184c0854-2e0d-11ef-9924-0242ac110002",
  email: 'franklinwebdev704@gmail.com',
    password: 'plaintextpassword'
  };

  let otpCode;

  it('should return 200 OK for the login route', (done) => {
    this.timeout(10000);
    agent
      .get("/admin/") 
      .end((err, res) => {
        if (err) return done(err);
        const $ = cheerio.load(res.text);
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

      const emailResult = await generateAndSendOTP(validUser.userId, validUser.email,adminModel);
      console.log(`otp code is ${emailResult}`)
      otpCode = emailResult;

      if (!otpCode) {
        throw new Error('OTP code not found in email');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }

    try {
      res = await agent
        .post('/admin/verifyOtp')
        .set('csrf-token', csrfToken)
        .send({ userId: validUser.userId, OTP: otpCode, _csrf: csrfToken });

      expect(res).to.have.cookie('connect.sid');
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  it('should allow a logged-in user to view items on the page', (done) => {
    agent
      .get(`/admin/dashboard`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        done();
      });
  });


  it('should return 200 OK for the add book with isbn route', (done) => {
    this.timeout(10000);
    agent
      .get("/admin/books/addBookWithISBN")
      .end((err, res) => {
        if (err) return done(err);
        const $ = cheerio.load(res.text);
        csrfToken = $('input[name=_csrf]').val();
        console.log(csrfToken)

        expect(csrfToken).to.exist;
        expect(res).to.have.status(200);
        done();
      });
  });


  it('should save books succesfully in the database from open libary', (done) => {
    agent
      .post(`/admin/books/addBookWithISBN`)
      .set('csrf-token', csrfToken)
      .send({isbn:isbn,_csrf: csrfToken} )
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(302);
        done();
      });
  });
});

describe('search book functionality ',function(){
  it('should access the home page route', (done) => {
    this.timeout(10000);
    agent
      .get("/")
      .end((err, res) => {
        if (err) return done(err);
        const $ = cheerio.load(res.text);
        csrfToken = $('input[name=_csrf]').val();
        console.log(csrfToken)

        expect(csrfToken).to.exist;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should successfully return an item searched that is found in the database", (done)=>{
    agent
    .post("/search")
    .set('csrf-token', csrfToken)
    .send({query:isbn,_csrf: csrfToken} )
    .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        done();
      });

  })

})
