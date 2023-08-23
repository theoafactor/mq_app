const express = require("express");
const axios = require("axios");
const https = require('https')
const Buffer = require("node:buffer");
// const terminate = curlTest.close.bind(curlTest);

const instance = axios.create({
  // ... other options ...
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})


const server = express();

var apiBase="/ibmmq/rest/v1/"


var options = {
    hostname:"localhost",
    port:9443,
    method:'GET',
    headers: {
      'Authorization': 'Basic ' + Buffer.Buffer("admin" + ':' + "passw0rd").toString('base64'),
      'Content-Type' : 'text/plain',
  // Need this header for POST operations even if it has no content
      'ibm-mq-rest-csrf-token' : ''
     }
  }


const putMessage = function(msg) {
    return new Promise((resolve,reject) =>  {
      options.method = 'POST';
      options.path = apiBase + "messaging/qmgr/" + "testmq1" + "/queue/" + "DEV.QUEUE.1" + "/message"


  
      // Create the request and aggregate any returned data
      var request = https.request(options,(response) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
          var errMsg = util.format("POST failed.\nStatusCode: %d\nStatusMessage: \n",response.statusCode, response.statusMessage);
          reject(new Error(errMsg));
  
        } else {
          console.log('POST   statusCode: ' + response.statusCode);
        }
        var body = '';
        response.on('data',(chunk) => body +=chunk);
        response.on('end', () => resolve());
      });
  
      request.on('error', (error) => reject(error));
      // Send the message contents
      request.write(msg);
      request.end();
    });
  };



server.get("/", async function(request, response){


    const feedback = await instance.get("https://localhost:9443/ibmmq/rest/v2/admin/qmgr", {
        headers: {
            'Authorization': 'Basic ' + Buffer.Buffer("admin" + ':' + 'passw0rd').toString('base64'),
            'Content-Type' : 'text/plain',
        // Need this header for POST operations even if it has no content
            'ibm-mq-rest-csrf-token' : ''
           }
    });


    

    if(feedback.status == 200){
        response.send({
            message: "Every is fine",
            data: feedback.data
        })
    }   


})


// put a message
server.post("/put_message", async function(request, response){

    const feedback = await instance.post(`https://localhost:9443/ibmmq/rest/v2/messaging/qmgr/testmq1/queue/DEV.QUEUE.1/message`, {}, {
        headers: {
            'Authorization': 'Basic ' + Buffer.Buffer("admin" + ':' + 'passw0rd').toString('base64'),
            'Content-Type' : 'text/plain',
            // Need this header for POST operations even if it has no content
            'ibm-mq-rest-csrf-token' : ''
        }
    });

    // putMessage("simple");

   


})




server.listen(1234, () => console.log("Server is listening on 1234"));