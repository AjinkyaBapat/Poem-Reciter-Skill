/*
  Code for the Alexa Skill: Poem Reciter
  Created By: Ajinkya Bapat
              ajinkyabapat12@gmail.com
*/

/*IMPORTANT: 
    
    1 - Please note that this code is **NOT A COMPLETE** Code & is just for a reference.
    2 - The code is TOO RAW & LACKS necessary COMMENTING

*/    

// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

var myRequest = "a";
var randomPoet;
const welcomeRePrompt = "Please provide your input"

// 2. Skill Code =======================================================================================================


var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);

    // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
    // alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes

    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.response.speak('Welcome to the Poem Skill. You can listen to a random poem by saying: Alexa, tell me a poem. ' + ' Or, you can listen to a poem of your favorite author by saying: Alexa, tell me a poem by Oscar Wilde. Just replace the poet name with your favorite authors name. ').listen(welcomeRePrompt);
        this.emit(':responseReady');
    },
    
    'Unhandled': function() {
        this.emit(':ask', 'Sorry, Given Poet name cannot be found. Please retry with another Poet name. ');
    },

    'GetPoemIntent': function () {
        
        modhttpGet(myRequest,  (myResult1) => {
            console.log("sent     : " + myRequest);
            console.log("received random author name: " + myResult1);
            
            randomPoet = myResult1;
            
            }
        );
        
        console.log("randomPoet: " + randomPoet);
        
        httpGet(randomPoet,  (myResult1, myResult2, myResult3) => {
                console.log("sent     : " + randomPoet);
                console.log("received : " + myResult1 + ", " + myResult2 + ", " + myResult3);
                
                this.response.speak('Hi! Now I will recite a random poem to you. ' + ' A Poem called ' + myResult2 + '  by: ' + randomPoet + '. ' + 'Reciting poem now:  ' + myResult3);
                this.emit(':responseReady');
            }
        );
        
    },
    
    'GetPoemBy': function () {
        
        var Poet = this.event.request.intent.slots.Poet.value;
        console.log("Poet Name from Slot: " + Poet);
        
        httpGet(Poet,  (myResult1, myResult2, myResult3) => {
                console.log("sent     : " + Poet);
                console.log("received : " + myResult1 + ", " + myResult2 + ", " + myResult3);
                
                if (myResult2 == "404") {
                    this.response.speak('Sorry, Given Poet name cannot be found. Please retry with another Poet name.');
                    this.emit(':responseReady');
                    
                } else {
                
                    this.response.speak('Here is a poem by: ' + myResult1 + '. ' + ' called: ' + myResult2 + '. ' + ' Reciting poem now: ' + myResult3);
                    this.emit(':responseReady');
                }
            }
        );

    },
    
    'AMAZON.HelpIntent': function () {
        speechOutput = "I'm here to help you. You can listen to a random poem by saying: Alexa, tell me a poem. Or, you can listen to a poem of your favorite author by saying: Alexa, tell me a poem by Oscar Wilde. Just replace the poet name with your favorite authors name. ";
        reprompt = "I'm waiting for your input ";
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    
    'AMAZON.CancelIntent': function () {
        speechOutput = "Cancelling the current operation.";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    
    'AMAZON.StopIntent': function () {
        speechOutput = "Thank you for allowing me to tell you a poem. Exiting for now!";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    
    'SessionEndedRequest': function () {
        var speechOutput = "Sorry, your session is over.";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
};


//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================


var http = require('http');
// https is a default part of Node.JS.  Read the developer doc:  https://nodejs.org/api/https.html
// try other APIs such as the current bitcoin price : https://btc-e.com/api/2/btc_usd/ticker  returns ticker.last

function httpGet(myData, callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey

    console.log("myData: " + myData);
    
    // Update these options with the details of the web service you would like to call
    var options = {
        
        //Insert Options required to make HTTP Request.

    };

    var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        
        
        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
            // console.log(JSON.stringify(returnData))
            // we may need to parse through it to extract the needed data
            
            console.log("returnData: " + returnData);
        
            var a = JSON.parse(returnData);
            var desc = JSON.parse(returnData);
            var total = JSON.parse(returnData).length;
            
            console.log("Status: " + a.status);
            
            if (a.status == "404") {
                
                console.log("Not Found");
                callback("", a.status, a.reason);
                
            } else {
                
                flag = true;
                
                while(flag === true) {
                
                    console.log("totalelements = " + total); // No. of poems returned
                    const index = Math.floor(Math.random() * total);
                    
                    console.log("Poem No: " + index);
                    
                    console.log("title: " + a[index].title);
                    console.log("lines: " + desc[index].lines);
                    
                    var temp = desc[index].lines;
                    console.log("temp: " + temp);
                    
                    temp = temp.toString();
                    
                    console.log("Length of Poem in Chars: " + temp.length);
                    
                    if(temp.length < 8000) {
                    
                        temp = temp.replace(/"",/g, '');
                        
                        temp = temp.replace(/\.,/g, '.');
                        console.log("temp: " + temp);
                        
                        temp = temp.replace(/;/g, '');
                        temp = temp.replace(/:/g, '');
                        temp = temp.replace(/,,/g, ',');
                        temp = temp.replace(/"/g, '');
                        temp = temp.replace(/\.,/g, '. ');
                        temp = temp.replace(/!,/g, '! ');
                        
                        //temp = temp.replace(/,/g, '. ');
                        console.log("temp: " + temp);
                        
                        temp = temp.split( /,/ ).reduce( (a,b, i) => i %2 === 0 ? a + "," + b : a + ". " + b );
                        
                        console.log("temp: " + temp);
                        
                        console.log("temp: " + temp);
                        
                        
                      //  temp = temp.replace(/. ,/g, ' ');
                      //  temp = temp.replace(/, ./g, ' ');
                        
                        temp = temp.replace(/[^a-zA-Z+'+.+,+!+\s]/g, ' ');
                        
                        temp = temp.replace(/\./g, '. ');
                        temp = temp.replace(/,/g, ', ');
                        
                        temp = temp.replace(/(Number)/g, '');
                        console.log("Final temp: " + temp);
                        
                        flag = false;
                        
                        callback(a[index].author, a[index].title, temp);  // this will execute whatever function the caller defined, with one argument
                    } else {
                        
                        console.log("Poem length exceeds the limit of voice service. Going up for another poem.");
                        flag = true;
                    }
                }
            }
        });

    });
    req.end();

}

var http = require('http');

function modhttpGet(myData, callback) {
    
        // GET is a web service request that is fully defined by a URL string
        // Try GET in your browser:
        // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey
    
    console.log("myData: " + myData);
        
    // Update these options with the details of the web service you would like to call
    var options = {

        //Insert Options required to make HTTP Request.
        
    };
    
    console.log("We're in modhttpGet");
    
    var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";
    
        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
         
        console.log("ret: " + returnData);   
            
        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
            // console.log(JSON.stringify(returnData))
            // we may need to parse through it to extract the needed data
          
            console.log("returnData: " + returnData);
            
            var a = JSON.parse(returnData);
            var total = JSON.parse(returnData).authors.length;
                
                
            if (a.status == "404") {
                console.log("Not Found");
                callback("Not Found");
                
            } else {
                console.log("totalelements = " + total); // No. of poems returned
                const index = Math.floor(Math.random() * total);
                
                console.log("Index: " + index);
                
                console.log("author name: " + a.authors[index]);
                
                callback(a.authors[index]);  // this will execute whatever function the caller defined, with one argument
            }
        });
        
    });
    req.end();
}
