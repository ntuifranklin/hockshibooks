

// // import { config } from 'dotenv';
// // import chai from 'chai';
// // import chaiHttp from 'chai-http';
// // import { describe, it, before } from 'mocha';
// // import supertest from 'supertest';
// // import cheerio from 'cheerio';


// config();
// // Set the environment variable before importing the server

// import { app } from "../server.js";

// const { expect } = chai;

// chai.use(chaiHttp);
// let server = app;
// let csrfToken;
// let agent = supertest.agent(server);

// describe('get a book from openlibary api and add it to the database', function() {
//   this.timeout(60000); 
 

//   it('should return 200 OK for the add book with isbn route', (done) => {
//     this.timeout(10000);
//     agent
//       .get("/admin/books/addBookWithISBN")
//       .end((err, res) => {
//         if (err) return done(err);
//         const $ = cheerio.load(res.text);
//         csrfToken = $('input[name=_csrf]').val();
//         console.log(csrfToken)

//         expect(csrfToken).to.exist;
//         expect(res).to.have.status(200);
//         done();
//       });
//   });


//   it('should save books succesfully in the database from open libary', (done) => {
//     const isbn="9781984878106"
//     agent
//       .post(`/admin/books/addBookWithISBN`)
//       .set('csrf-token', csrfToken)
//       .send({isbn:isbn,_csrf: csrfToken} )
//       .end((err, res) => {
//         if (err) return done(err);
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
// });
