

//clustering
const cluster = require("cluster");
const totalCPUs = require("os").availableParallelism();

const {startNewHockshiServer} = require('./server.js');

// for server ip :
const ip = require("ip");

const {isTestEnvUpgraded} = require('./utilities/functions.js');

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
  console.log(`\n\tChild process started : `);
  console.log(`\tprocessID ${process.pid} `);
  console.log(`\ttime started: at :${(new Date()).toISOString()}`)
      
} ;