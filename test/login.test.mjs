

import { config } from 'dotenv';
import { env } from 'node:process';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, before } from 'mocha';
import nodemailerMock from 'nodemailer-mock';
import supertest from 'supertest';
import cheerio from 'cheerio';


config();
// Set the environment variable before importing the server

import { app } from "../server.js";
import { generateAndSendOTP } from '../utilities/functions.js';

const { expect } = chai;

chai.use(chaiHttp);
let server = app;
let csrfToken;
let agent = supertest.agent(server);

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

      const emailResult = await generateAndSendOTP(validUser.userId, validUser.email);
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
});
