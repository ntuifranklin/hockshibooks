
import config from 'dotenv';
import express from 'express';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, before,after} from 'mocha';
import nodemailerMock from 'nodemailer-mock';
import supertest from "supertest";
import { assert,expect,should } from "chai";
import * as cheerio from "cheerio";

import otpModel from "../models/otpModel.js";
import adminModel from "../models/adminModel.js";

import {startNewHockshiServer} from '../server.js';
import {generateAndSendOTP} from '../utilities/functions.js';

config.config();
process.env.NODE_ENV = process.env.TEST_ENV;

chai.use(chaiHttp);
let app = await startNewHockshiServer();
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
  
      // Step 4: Send POST request to verify OTP
      const otpResponse = await agent
        .set('csrf-token', csrfToken)
        .post('/admin/verifyOtp')
        .send({ userId: validUser.userId, OTP: otpCode, _csrf: csrfToken })
        
  
      // Validate that the response has the correct cookie
      expect(otpResponse).to.have.cookie('connect.sid');
    } catch (err) {
      //console.log(`${err.message}`);
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
    
    let res = await agent.get("/books/addBookWithExternalAPI")
    let csrfToken = extractCsrfToken(res);
    let postResponse = await agent
      .post(`/books/addBookWithExternalAPI`)
      .set('csrf-token', csrfToken)
      .send({isbn:isbn,_csrf: csrfToken, qty:1} )
    expect(postResponse).to.have.status(200);
  });
  
});

