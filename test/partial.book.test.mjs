
import config from 'dotenv';
import express from 'express';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, before,after} from 'mocha';

import supertest from "supertest";
import { assert,expect,should } from "chai";
import * as cheerio from "cheerio";


import {startNewHockshiServer} from '../server.js';

config.config();
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

describe('search book functionality ',async () => {
 
  it('should access the home page route', async () => {
    
    let res = await agent.get("/books");
    csrfToken = extractCsrfToken(res);
    let postResponse =  agent
      .post(`/books/search`)
      .set('csrf-token', csrfToken)
      .send({isbn:isbn,_csrf: csrfToken} )
      expect(postResponse).to.have.status(200);
  });

  it("should successfully return an item searched that is found in the database",async ()=>{
    
    let res = await agent.get("/books");
    csrfToken = extractCsrfToken(res);
    let postResponse = agent
    .post("/books/search")
    .set('csrf-token', csrfToken)
    .send({query:isbn,_csrf: csrfToken} )
    expect(postResponse).to.have.status(200);
    expect(postResponse).to.be.html;
  }) ;
  

})
