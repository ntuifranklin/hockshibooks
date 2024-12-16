
import config from 'dotenv';
import express from 'express';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, before,after} from 'mocha';

import supertest from "supertest";
import { assert,expect,should } from "chai";
import * as cheerio from "cheerio";

import otpModel from "../models/otpModel.js";
import adminModel from "../models/adminModel.js";

let adminUser = await adminModel.findOne({ where: { email: process.env.TEST_VALID_POWER_USER_EMAIL } });

const validUser = {
  userId: adminUser.id,
  email: process.env.TEST_VALID_POWER_USER_EMAIL,
  password: process.env.TEST_VALID_POWER_USER_PASSWORD,
};

import {generateAndSendOTP} from '../utilities/functions.js';
import {startNewHockshiServer} from '../server.js';

config.config();
chai.use(chaiHttp);
let app = await startNewHockshiServer();
let csrfToken;
let agent = supertest.agent(app);
const isbns = [
  "9781937856243",
  "9780358108535",
  "9781416609490",
  "9781420151831",
  "9780063086272",
  "0679805273",
  "9780989600804",
  "9780309069960",
  "316107484",
  "9780385353670",
  "9781591841906",
  "9780309063630",
  "9780689866852",
  "9781880114001",
  "9780399581120"
];
const isbn="9780309063630"

function  extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
 }

describe('search book functionality ',async () => {
 
  it('It should access the home page route and search for a book isbn', async () => {
    
    let res = await agent.get("/");
    csrfToken = extractCsrfToken(res);
    let postResponse =  await agent
      .post(`/books/search`)
      .set('csrf-token', csrfToken)
      .send({query:isbn,_csrf: csrfToken} )
      expect(postResponse).to.have.status(200);
  });

  it("It should add a list of isbns to the database and successfully return the item that is found in the database",async ()=>{
    
    
    let res = await agent.get('/admin');
    let csrfToken = extractCsrfToken(res);


    // Validate response (Example: checking status)
    expect(res).to.have.status(200);

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

    csrfToken = extractCsrfToken(postResponse);
    // Step 4: Send POST request to verify OTP
    const otpResponse = await agent
      .set('csrf-token', csrfToken)
      .post('/admin/verifyOtp')
      .send({ userId: validUser.userId, OTP: otpCode, _csrf: csrfToken })

    //expect(otpResponse).to.have.cookie('connect.sid');
    //console.log('otp response: ',otpResponse);
    
    //csrfToken = extractCsrfToken(otpResponse);
    for(let isbni of isbns){
        
      agent
      .post("/books/addBookWithExternalAPI")
      .set('csrf-token', csrfToken)
      .send({isbn:isbni,_csrf: csrfToken, quantity:3,price:6.99} ).then((err,isbnResponse)=>{
        if(err){
          console.log(err)
        }
              //console.log(Object.keys(isbnResponse))
        expect(isbnResponse).to.have.status(200);
        expect(isbnResponse).to.be.json; //because we are calling from the command line
        
      });
    } ;

    //now search
    for(let isbni of isbns){
        
      agent
      .post("/books/search")
      .set('csrf-token', csrfToken)
      .send({query:isbni,_csrf: csrfToken} ).then((err,isbnSearchResponse)=>{
        if(err){
          console.log(err)
        }
              //console.log(Object.keys(isbnResponse))
        expect(isbnSearchResponse).to.have.status(200);
        expect(isbnSearchResponse).to.be.html; //because we are calling from the command line
        
      });

      
    }
   
  }) ;
  

})

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  app.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});