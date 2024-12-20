
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
import bookModel from "../models/bookModel.js";
const validBookConditions = bookModel.getAttributes().book_condition.values;
const validBookFormats = bookModel.getAttributes().format.values;

import {faker} from '@faker-js/faker';

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
  //"0679805273",
  "9780989600804",
  "9780309069960",
  //"316107484",
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

    //csrfToken = extractCsrfToken(postResponse);
    // Step 4: Send POST request to verify OTP
    const otpResponse = await agent
      .set('csrf-token', csrfToken)
      .post('/admin/verifyOtp')
      .send({ userId: validUser.userId, OTP: otpCode, _csrf: csrfToken })

    //expect(otpResponse).to.have.cookie('connect.sid');
    //console.log('otp response: ',otpResponse);
    
    csrfToken = extractCsrfToken(otpResponse);    
    
    /* 
     add books with random 
     values selected from the valid book conditions and formats */
    for(let isbni of isbns){
      //generate one random word with faker, for book condition
      //if the random word is a valid book condition, then the server should accept, else reject
      let book_condition = faker.helpers.arrayElement(validBookConditions);
      let format = faker.helpers.arrayElement(validBookFormats);        
      agent
      .post("/books/addBookWithExternalAPI")
      .set('csrf-token', csrfToken)
      .send({
        isbn:isbni,
        _csrf: csrfToken, 
        quantity:3,
        book_condition:book_condition,
        format:format,
        price:6.99
      } ).then((err,isbnResponse)=>{
        if(err){
          console.log(err)
        };
        expect(isbnResponse).to.not.have.status(200);
        expect(isbnResponse).to.be.json; //because we are using ajax in the form
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

  it("It should not add a list of isbns to the database if the price or quantity is a string or any value that is not a float or integer respectively",async ()=>{
    
    
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

    //csrfToken = extractCsrfToken(postResponse);
    // Step 4: Send POST request to verify OTP
    const otpResponse = await agent
      .set('csrf-token', csrfToken)
      .post('/admin/verifyOtp')
      .send({ userId: validUser.userId, OTP: otpCode, _csrf: csrfToken })

    //expect(otpResponse).to.have.cookie('connect.sid');
    //console.log('otp response: ',otpResponse);
    
    csrfToken = extractCsrfToken(otpResponse);    
    
    /* 
     add books with random 
     values selected from the valid book conditions and formats */
    for(let isbni of isbns){
      //generate one random word with faker, for book condition
      //if the random word is a valid book condition, then the server should accept, else reject
      let book_condition = faker.helpers.arrayElement(validBookConditions);
      let format = faker.helpers.arrayElement(validBookFormats);    
      let fake_price = faker.lorem.word();
      let fake_quantity = faker.lorem.word();    
      agent
      .post("/books/addBookWithExternalAPI")
      .set('csrf-token', csrfToken)
      .send({
        isbn:isbni,
        _csrf: csrfToken, 
        quantity:fake_quantity,
        book_condition:book_condition,
        format:format,
        price:fake_price
      } ).then((err,isbnResponse)=>{
        if(err){
          console.log(err)
        };
        expect(isbnResponse).to.not.have.status(200);
        expect(isbnResponse).to.be.json; //because we are using ajax in the form
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

  it("It should not add a list of isbns to the database if the book format or book condition is not an accepted valid value",async ()=>{
    
    
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

    //csrfToken = extractCsrfToken(postResponse);
    // Step 4: Send POST request to verify OTP
    const otpResponse = await agent
      .set('csrf-token', csrfToken)
      .post('/admin/verifyOtp')
      .send({ userId: validUser.userId, OTP: otpCode, _csrf: csrfToken })

    //expect(otpResponse).to.have.cookie('connect.sid');
    //console.log('otp response: ',otpResponse);
    
    csrfToken = extractCsrfToken(otpResponse);
    //add books with random words for book condition and format
    for(let isbni of isbns){
      //generate one random word with faker, for book condition
      //if the random word is a valid book condition, then the server should accept, else reject
      let book_condition = faker.lorem.word();
      let format = faker.lorem.word();        
      agent
      .post("/books/addBookWithExternalAPI")
      .set('csrf-token', csrfToken)
      .send({
        isbn:isbni,
        _csrf: csrfToken, 
        quantity:3,
        book_condition:book_condition,
        format:format,
        price:6.99
      } ).then((err,isbnResponse)=>{
        if(err){
          console.log(err)
        }
              //console.log(Object.keys(isbnResponse))
        if(validBookConditions.includes(book_condition) && validBookFormats.includes(format)){
          expect(isbnResponse).to.have.status(200);
        } else {
          expect(isbnResponse).to.not.have.status(200);
          
        } ;
        expect(isbnResponse).to.be.json; //because we are using ajax in the form
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












  
  it("It should not add a list of isbns to the database if any of the required fields is missing",async ()=>{
    
    
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

    //csrfToken = extractCsrfToken(postResponse);
    // Step 4: Send POST request to verify OTP
    const otpResponse = await agent
      .set('csrf-token', csrfToken)
      .post('/admin/verifyOtp')
      .send({ userId: validUser.userId, OTP: otpCode, _csrf: csrfToken })

    //expect(otpResponse).to.have.cookie('connect.sid');
    //console.log('otp response: ',otpResponse);
    
    csrfToken = extractCsrfToken(otpResponse);
    //add books with random words for book condition and format
    for(let isbni of isbns){
      //generate one random word with faker, for book condition
      //if the random word is a valid book condition, then the server should accept, else reject
      let book_condition = faker.lorem.word();
      let format = faker.lorem.word();  
      //add with qunatity missing      
      agent
      .post("/books/addBookWithExternalAPI")
      .set('csrf-token', csrfToken)
      .send({
        isbn:isbni,
        _csrf: csrfToken, 
        //quantity:3,
        book_condition:book_condition,
        format:format,
        price:6.99
      } ).then((err,isbnResponse)=>{
        if(err){
          console.log(err)
        }
              //console.log(Object.keys(isbnResponse))
        if(validBookConditions.includes(book_condition) && validBookFormats.includes(format)){
          expect(isbnResponse).to.have.status(200);
        } else {
          expect(isbnResponse).to.not.have.status(200);
          
        } ;
        expect(isbnResponse).to.be.json; //because we are using ajax in the form
      });

      //add with price missing
      agent
      .post("/books/addBookWithExternalAPI")
      .set('csrf-token', csrfToken)
      .send({
        isbn:isbni,
        _csrf: csrfToken, 
        quantity:3,
        book_condition:book_condition,
        format:format,
        //price:6.99
      } ).then((err,isbnResponse)=>{
        if(err){
          console.log(err)
        }
              //console.log(Object.keys(isbnResponse))
        if(validBookConditions.includes(book_condition) && validBookFormats.includes(format)){
          expect(isbnResponse).to.have.status(200);
        } else {
          expect(isbnResponse).to.not.have.status(200);
          
        } ;
        expect(isbnResponse).to.be.json; //because we are using ajax in the form
      });
      //add with format missing
      agent
      .post("/books/addBookWithExternalAPI")
      .set('csrf-token', csrfToken)
      .send({
        isbn:isbni,
        _csrf: csrfToken, 
        quantity:3,
        book_condition:book_condition,
        //format:format,
        price:6.99
      } ).then((err,isbnResponse)=>{
        if(err){
          console.log(err)
        }
              //console.log(Object.keys(isbnResponse))
        if(validBookConditions.includes(book_condition) && validBookFormats.includes(format)){
          expect(isbnResponse).to.have.status(200);
        } else {
          expect(isbnResponse).to.not.have.status(200);
          
        } ;
        expect(isbnResponse).to.be.json; //because we are using ajax in the form
      });
      //add with book condition missing
      agent
      .post("/books/addBookWithExternalAPI")
      .set('csrf-token', csrfToken)
      .send({
        isbn:isbni,
        _csrf: csrfToken, 
        quantity:3,
        //book_condition:book_condition,
        format:format,
        price:6.99
      } ).then((err,isbnResponse)=>{
        if(err){
          console.log(err)
        }
              //console.log(Object.keys(isbnResponse))
        if(validBookConditions.includes(book_condition) && validBookFormats.includes(format)){
          expect(isbnResponse).to.have.status(200);
        } else {
          expect(isbnResponse).to.not.have.status(200);
          
        } ;
        expect(isbnResponse).to.be.json; //because we are using ajax in the form
      });
      //add with isbn missing
      agent
      .post("/books/addBookWithExternalAPI")
      .set('csrf-token', csrfToken)
      .send({
        //isbn:isbni,
        _csrf: csrfToken, 
        quantity:3,
        book_condition:book_condition,
        format:format,
        price:6.99
      } ).then((err,isbnResponse)=>{
        if(err){
          console.log(err)
        }
              //console.log(Object.keys(isbnResponse))
        if(validBookConditions.includes(book_condition) && validBookFormats.includes(format)){
          expect(isbnResponse).to.have.status(200);
        } else {
          expect(isbnResponse).to.not.have.status(200);
          
        } ;
        expect(isbnResponse).to.be.json; //because we are using ajax in the form
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