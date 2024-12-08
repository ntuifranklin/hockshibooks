

//clustering
const cluster = require("cluster");
const totalCPUs = require("os").availableParallelism();

const {startNewHockshiServer} = require('./server.js');


if (cluster.isPrimary) {
    
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Primary Process ${process.pid} is running`);
   
    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
      cluster.fork();
    }
   
    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      console.log("Let's fork another worker!");
      cluster.fork();
    });
} else {     
    
  startNewHockshiServer() ;
  console.log(`\nChild process started : `);
  console.log(`\tProcessID ${process.pid} `);
  console.log(`\tTime started :${(new Date()).toISOString()}`)
      
} ;