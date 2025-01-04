
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
import inventoryModel from "../models/inventory.js";
import genreModel from '../models/genreModel.js';

import {faker} from '@faker-js/faker';
let adminUser = await adminModel.findOne({ where: { email: process.env.TEST_VALID_POWER_USER_EMAIL } });

const validUser = {
  userId: adminUser.id,
  email: process.env.TEST_VALID_POWER_USER_EMAIL,
  password: process.env.TEST_VALID_POWER_USER_PASSWORD,
};

import {generateAndSendOTP} from '../utilities/functions.js';
import {startNewHockshiServer} from '../server.js';

const validBookConditions = bookModel.getAttributes().book_condition.values;
const validBookFormats = bookModel.getAttributes().format.values;


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
  "9780989600804",
  "9780309069960",
  "9780385353670",
  "9781591841906",
  "9780309063630",
  "9780689866852",
  "9781880114001",
  "9780399581120"
];
const isbn="9780309063630"

const allGenres = await genreModel.findAll();
function  extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
 }

describe('search book functionality ',async () => {
 

  it("It should add a list of isbns to the database and successfully update their quantity and price successfully",async ()=>{
    try{        
    
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
    
    //csrfToken = extractCsrfToken(otpResponse);
    for(let isbni of isbns){
      let format = faker.helpers.arrayElement(validBookFormats);     
      let book_condition = faker.helpers.arrayElement(validBookConditions);
      agent
      .post("/books/addBookWithExternalAPI")
      .set('csrf-token', csrfToken)
      .send({
        isbn:isbni,
        _csrf: csrfToken, 
        quantity:3,
        book_condition:book_condition,
        format:format,
        price:12.99,
        genres:allGenres.map(genre=>genre.id)
      } )
      .then((errPostISBN,isbnAddPostReponse)=>{
        if(errPostISBN){
          //console.log(`Error adding book with ISBN ${isbni}`);
          throw(errPostISBN);
        };
        expect(isbnAddPostReponse).to.have.status(200);
        
        expect(isbnAddPostReponse).to.be.json; //because we are calling from the command line
      });
    } ;

    //now for each book, updates its quantity and price
    //first get the book id from the isbn and then update the book
    for(let isbni of isbns){
      
      let format = faker.helpers.arrayElement(validBookFormats);     
      let book_condition = faker.helpers.arrayElement(validBookConditions);
      let bookMightExist = await bookModel.findAll({
          where:{
              ISBN:isbni
          },
          include:[{model:inventoryModel}]
      });
      //console.log(`Book : ${JSON.stringify(bookMightExist,null, 2)}`);
      if (bookMightExist && bookMightExist.length>0) {
          let book = await JSON.parse(JSON.stringify(bookMightExist[0]));
          //console.log(`Book with ISBN ${JSON.stringify(book,null, 2)} found`);
          let bookUpdateObject = {
              title: book.title,
              author: book.author,
              language: book.language,
              bookId: book.book_id, 
              quantity: parseInt(inventoryModel.quantity_available)*2, 
              genres: allGenres.map(genre => genre.genre_id),
              price: (parseFloat(book.price)*2).toFixed(2), 
              _csrf: csrfToken,
              location: book.Inventory.location, 
              format: format,
              book_condition: book_condition,
          };
          let updateBookResponse = await agent
          .post("/books/update")
          .set('csrf-token', csrfToken)
          .send(bookUpdateObject);
          //csrfToken = extractCsrfToken(updateBookResponse);
          expect(updateBookResponse).to.have.status(200);
          expect(updateBookResponse).to.be.json;
      } else {
        console.log(`Book with ISBN ${isbni} not found`);
      }
    
    }

    
    }catch(e){
        console.log(e.message);

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