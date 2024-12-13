
import config from 'dotenv';
config.config({ path: '../.test.env' });

import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, before,after} from 'mocha';
import nodemailerMock from 'nodemailer-mock';
import supertest from "supertest";
import { assert,expect,should } from "chai";
import * as cheerio from "cheerio";


import {startNewHockshiServer} from '../server.js';
import {generateAndSendOTP} from '../utilities/functions.js';

import otpModel from "../models/otpModel.js";
import adminModel from "../models/adminModel.js";

let app = await startNewHockshiServer();
setTimeout(() => {}, 3000);
chai.use(chaiHttp);
let csrfToken;
let agent = supertest.agent(app);
const isbns = [
  9781937856243,
  9780358108535,
  9781416609490,
  9781420151831,
  9780063086272,
  679805273,
  9780989600804,
  9780309069960,
  316107484,
  9780385353670,
  9781591841906,
  9780309063630,
  9780689866852,
  9781880114001,
  9780399581120
];
const isbn="9780309063630"

function  extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
 }

 
 let adminUser = await adminModel.findOne({ where: { email: process.env.TEST_VALID_POWER_USER_EMAIL } });

 const validUser = {
   userId: adminUser.id,
   email: process.env.TEST_VALID_POWER_USER_EMAIL,
   password: process.env.TEST_VALID_POWER_USER_PASSWORD,
 };

 //console.log(`Valid user is ${JSON.stringify(validUser, null, 2)}`);
 let otpCode;

describe('User Authentication and Page Access with OTP', async function() {

  it('should return 200 OK for the login route',  async () => {
    
    let res = await agent.get("/admin/")
    let csrfToken = extractCsrfToken(res);    
    expect(res).to.have.status(200);
    expect(csrfToken).to.exist;
    
  });
  it('This should login successfully with correct credentials and OTP', async() => {
    
    try {
      // Step 1: Send GET request to /admin to get the CSRF token
      const res = await agent.get('/admin');
      let csrfToken = extractCsrfToken(res);
  
      // Step 2: Send POST request to /admin with the CSRF token and valid credentials
      const postResponse =  await agent
      .set('csrf-token', csrfToken)
      .post('/admin')
      .send({ ...validUser, _csrf: csrfToken });
  
      // Validate response (Example: checking status)
      expect(postResponse).to.have.status(200);
  
      // Step 3: Generate and send OTP
      const emailResult = await  generateAndSendOTP(validUser.userId, validUser.email, otpModel);
      //console.log(`OTP code is ${emailResult}`);
      const otpCode = emailResult;
  
      if (!otpCode) {
        throw new Error('OTP code not found in email');
      }
      expect(otpCode).to.exist; 
  
      csrfToken = extractCsrfToken(postResponse);
      // Step 4: Send POST request to verify OTP
      const otpResponse = await agent
        .set('csrf-token', csrfToken)
        .post('/admin/verifyOtp')
        .send({ userId: validUser.userId, OTP: otpCode, _csrf: csrfToken })
        
  
      // Validate that the response has the correct cookie
      expect(otpResponse).to.have.cookie('connect.sid');
      expect(otpResponse).to.have.status(302);
    } catch (err) {
      console.log(`${err.message}`);
      throw err;
    }
  });
  

  it('should allow a logged-in user to view items on the page', async () => {
    
    let res = await agent
      .get(`/admin/dashboard`)
      expect(res).to.have.status(200);
  });


  it('this should return 200 OK for the add book with isbn route', async () => {
    
    let res = await agent.get("/books/addBookWithExternalAPI")
        csrfToken = extractCsrfToken(res);
        //console.log(csrfToken)

        expect(csrfToken).to.exist;
        expect(res).to.have.status(200);
  });


  it('should save books succesfully in the database from open libary', async() => {
    //need to log in first
    
    let res = await agent.get('/admin');
    let csrfToken = extractCsrfToken(res);

    // Step 2: Send POST request to /admin with the CSRF token and valid credentials
    let postResponse =  await agent
    .set('csrf-token', csrfToken)
    .post('/admin')
    .send({ ...validUser, _csrf: csrfToken });

    // Validate response (Example: checking status)
    expect(postResponse).to.have.status(200);

    // Step 3: Generate and send OTP
    let emailResult = await  generateAndSendOTP(validUser.userId, validUser.email, otpModel);
    //console.log(`OTP code is ${emailResult}`);
    let otpCode = emailResult;

    if (!otpCode) {
      throw new Error('OTP code not found in email');
    }
    expect(otpCode).to.exist; 

    // Step 4: Send POST request to verify OTP
    let otpResponse = await agent
      .set('csrf-token', csrfToken)
      .post('/admin/verifyOtp')
      .send({ userId: validUser.userId, OTP: otpCode, _csrf: csrfToken })
      

    // Validate that the response has the correct cookie
    expect(otpResponse).to.have.cookie('connect.sid');

    res = await agent.get("/admin/dashboard")
    csrfToken = extractCsrfToken(res);
    expect(res).to.have.status(200);

    //when a user logs out and access the dashboard they should be redirected to the login page
    res = await agent.get("/admin/logout")
    expect(res).to.have.status(302);
    
    //when a user logs out and access the dashboard they should be redirected to the login page
    res = await agent.get("/admin/dashboard")
    expect(res).to.have.status(302);
    //the respons eshould contain an email and password field
    res = await agent.get("/admin/")
    expect(res).to.have.status(200);
    csrfToken = extractCsrfToken(res);
    expect(csrfToken).to.exist;
    //console.log(csrfToken)
    // Step 2: Send POST request to /admin with the CSRF token and valid credentials
    postResponse =  await agent
    .set('csrf-token', csrfToken)
    .post('/admin')
    .send({ ...validUser, _csrf: csrfToken });    
    
  });
  
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  app.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
