/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');



/*const GetJokeHandler1 = {
  canHandle(handlerInput) {
   //const request = handlerInput.requestEnvelope.request;
    //return request.type === 'IntentRequest'
      //&& request.intent.name === 'GetJokeIntent';
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'
      ||  (request.type === 'IntentRequest'
        && request.intent.name === 'GetJokeHandler')
    
     
  },
  
  
  async handle(handlerInput) {
    const response = await httpGet();
    
    console.log(response);

    return handlerInput.responseBuilder
            .speak("Okay. Here is what I got back from my request. for you anurag " + response.value.joke)
            .reprompt("What would you like?")
            .getResponse();
  },
};*/

var Request = require('request');

const GetJokeHandler1 = {
    canHandle(handlerInput) {
     //const request = handlerInput.requestEnvelope.request;
      //return request.type === 'IntentRequest'
        //&& request.intent.name === 'GetJokeIntent';
          const request = handlerInput.requestEnvelope.request;
          return request.type === 'LaunchRequest'
        ||  (request.type === 'IntentRequest'
          && request.intent.name === 'GetJokeHandler')
      
       
    },
    


    async handle(handlerInput) {
      const res = await getDetails(); 
      
        if(res.status === 200)
        {
            const ingredients = res.product[0].ingredients;
            
            var flag = false;

            const usersAllergy = ['nuts', 'milk']; //this will come from NoSQL DB in array form

             ingredients.forEach(e_1 => {
                usersAllergy.forEach(e_2 => {
                    if(e_1 === e_2)
                    {
                        flag = true;
                        return;
                    }
                });
            });
            
            // ingredients.every(function(e_1, index) {
            //     usersAllergy.every(function(e_2, index) {
            //         if(e_1 === e_2)
            //         {
            //             flag = true;
            //             return ;
            //         }
            //     });
            // });
            console.log(flag)

            if(flag)
            {
                const speakOutput = "You cannot have this product"; //tell user that he can or cannot have the product
                return handlerInput.responseBuilder
                        .speak(speakOutput)
                        .reprompt("Abc")
                        .getResponse();
            }
            else
            {
                const speakOutput = "You can have this product"; //tell user that he can or cannot have the product
                return handlerInput.responseBuilder
                        .speak(speakOutput)
                        .reprompt("abc")
                        .getResponse();
            }
        }
        else
        {
            console.log(res.message); //or 'res.message' can be given to .speak() directly
        }

    //   console.log(response);
  
    //   return handlerInput.responseBuilder
    //           .speak("Okay. Here is what I got back from my request, for you anurag " + response.value.joke)
    //           .reprompt("What would you like?")
    //           .getResponse();
    },
  };

  
  
  function getDetails() {
    return new Promise(((resolve, reject) => {
    //   var options = {
    //       host: 'https://dietary-care.herokuapp.com/',
    //       port: 22436,
    //       path: '/jokes/random',
    //       method: 'GET',
    //   };
      
    //   const request = https.request(options, (response) => {
    //     response.setEncoding('utf8');
    //     let returnData = '';
  
    //     response.on('data', (chunk) => {
    //       returnData += chunk;
    //     });
  
    //     response.on('end', () => {
    //       resolve(JSON.parse(returnData));
    //     });
  
    //     response.on('error', (error) => {
    //       reject(error);
    //     });
    //   });
    //   request.end();

   const product = 'britania cake'; //this should be captured from the user's query

    Request.get(`https://dietary-care.herokuapp.com/${product}`, function(err, res, body)
    {
        if(err)
        {
            reject(err);
        }

        const data = JSON.parse(body);
        resolve(data);
    });
    }));
  }
   

/*const HelloMe1 = {
  canHandle(handlerInput) {
   
        const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'HelloMe')
  },  
        handle(handlerInput) {
    const factArr = data;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
    
     
  },
};

*/


/*const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const factArr = data;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};*/

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('xxxx.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'dietary care';
const GET_FACT_MESSAGE = 'Here\'s your Training Question: ';
const HELP_MESSAGE = 'You can say tell me a Training Question, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = [
  'Doha Bank has tied up with Reliance group to generate business opportunities in the Gulf Cooperation Council nations and India.',
  'Arvind Panagriya has been appointed as the Sherpa for G-20 talks in place of Railway Minister Suresh Prabhu by union government.',
];

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    //LaunchRequestHandler,
   // HelloWorldIntentHandler,
  // HelloMe1,
    GetJokeHandler1,
   // GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
