

//clustering
const cluster = require("cluster");
const totalCPUs = require("os").availableParallelism();

const {startNewHockshiServer} = require('./server.js');

// for server ip :
const ip = require("ip");

const {isTestEnvUpgraded} = require('./utilities/functions.js');

if (cluster.isMaster) {
    
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);
   
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
    
  console.log(`Child process ID ${process.pid}`);
    let _ = startNewHockshiServer() ;
      
} ;