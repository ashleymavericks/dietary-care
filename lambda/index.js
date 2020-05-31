/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const APP_NAME = "customer info";
const messages = {
  NOTIFY_MISSING_PERMISSIONS: 'Please enable profile permissions in the Amazon Alexa app.',
  ERROR: 'Uh Oh. Looks like something went wrong.'
};

const FULL_NAME_PERMISSION = "alexa::profile:name:read";
const EMAIL_PERMISSION = "alexa::profile:email:read";
const MOBILE_PERMISSION = "alexa::profile:mobile_number:read";

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const { serviceClientFactory, responseBuilder } = handlerInput;
    try {
      const upsServiceClient = serviceClientFactory.getUpsServiceClient();
      const profileName = await upsServiceClient.getProfileName();
      const speechResponse = `Hello, ${profileName} , Welcome to Dietary Care. How are you feeling today?`;
      const speechText= "How are you feeling today?"
      return responseBuilder
                      .speak(speechResponse)
                      .reprompt(speechText)
                      .withSimpleCard(APP_NAME, speechResponse)
                      .getResponse();
    } catch (error) {
      console.log(JSON.stringify(error));
      if (error.statusCode === 403) {
        return responseBuilder
        .speak(messages.NOTIFY_MISSING_PERMISSIONS)
        .withAskForPermissionsConsentCard([FULL_NAME_PERMISSION])
        .getResponse();
      }
      console.log(JSON.stringify(error));
      
      const response = responseBuilder.speak(messages.ERROR).getResponse();
      return response;
    }
  },
}

const GreetMeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GreetMeIntent';
  },
  async handle(handlerInput) {
    const { serviceClientFactory, responseBuilder } = handlerInput;
    try {
      const upsServiceClient = serviceClientFactory.getUpsServiceClient();
      const profileName = await upsServiceClient.getProfileName();
      const speechResponse = `Glad to hear about it. Please tell me about your allergen.`;
      return responseBuilder
                      .speak(speechResponse)
                      .withSimpleCard(APP_NAME, speechResponse)
                      .getResponse();
    } catch (error) {
      console.log(JSON.stringify(error));
      if (error.statusCode === 403) {
        return responseBuilder
        .speak(messages.NOTIFY_MISSING_PERMISSIONS)
        .withAskForPermissionsConsentCard([FULL_NAME_PERMISSION])
        .getResponse();
      }
      console.log(JSON.stringify(error));
      const response = responseBuilder.speak(messages.ERROR).getResponse();
      return response;
    }
  },
}

const MyAllergenIsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'MyAllergenIsIntent';
  },
  async handle(handlerInput) {

    const allergenValue = handlerInput.requestEnvelope.request.intent.slots.name.value;
    let speechText = `Sure, I will remember that you are allergic to ${allergenValue}. Go ahead and tell me about the manufacturer and procuct name you want to check for allergies`;

    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const attributes = await attributesManager.getSessionAttributes() || {};
    attributes.allergenValue = allergenValue;
    attributesManager.setSessionAttributes(attributes);
    
    return responseBuilder
      .speak(speechText)
      .reprompt(`Tell me about the manufacturer and product name you want to check for allergies`)
      .getResponse();
  },
};


// const EmailIntentHandler = {
//   canHandle(handlerInput) {
//     return handlerInput.requestEnvelope.request.type === 'IntentRequest'
//       && handlerInput.requestEnvelope.request.intent.name === 'EmailIntent';
//   },
//   async handle(handlerInput) {
//     const { serviceClientFactory, responseBuilder } = handlerInput;
//     try {
//       const upsServiceClient = serviceClientFactory.getUpsServiceClient();
//       const profileEmail = await upsServiceClient.getProfileEmail();
//       if (!profileEmail) {
//         const noEmailResponse = `It looks like you don't have an email set. You can set your email from the companion app.`
//         return responseBuilder
//                       .speak(noEmailResponse)
//                       .withSimpleCard(APP_NAME, noEmailResponse)
//                       .getResponse();
//       }
//       const speechResponse = `Your email is, ${profileEmail}`;
//       return responseBuilder
//                       .speak(speechResponse)
//                       .withSimpleCard(APP_NAME, speechResponse)
//                       .getResponse();
//     } catch (error) {
//       console.log(JSON.stringify(error));
//       if (error.statusCode === 403) {
//         return responseBuilder
//         .speak(messages.NOTIFY_MISSING_PERMISSIONS)
//         .withAskForPermissionsConsentCard([EMAIL_PERMISSION])
//         .getResponse();
//       }
//       console.log(JSON.stringify(error));
//       const response = responseBuilder.speak(messages.ERROR).getResponse();
//       return response;
//     }
//   },
// }

// const MobileIntentHandler = {
//   canHandle(handlerInput) {
//     return handlerInput.requestEnvelope.request.type === 'IntentRequest'
//       && handlerInput.requestEnvelope.request.intent.name === 'MobileIntent';
//   },
//   async handle(handlerInput) {
//     const { serviceClientFactory, responseBuilder } = handlerInput;
//     try {
//       const upsServiceClient = serviceClientFactory.getUpsServiceClient();
//       const profileMobileObject = await upsServiceClient.getProfileMobileNumber();
//       if (!profileMobileObject) {
//         const errorResponse = `It looks like you don't have a mobile number set. You can set your mobile number from the companion app.`
//         return responseBuilder
//                       .speak(errorResponse)
//                       .withSimpleCard(APP_NAME, errorResponse)
//                       .getResponse();
//       }
//       const profileMobile = profileMobileObject.phoneNumber;
//       const speechResponse = `Your mobile number is, <say-as interpret-as="telephone">${profileMobile}</say-as>`;
//       const cardResponse = `Your mobile number is, ${profileMobile}`
//       return responseBuilder
//                       .speak(speechResponse)
//                       .withSimpleCard(APP_NAME, cardResponse)
//                       .getResponse();
//     } catch (error) {
//       console.log(JSON.stringify(error));
//       if (error.statusCode === 403) {
//         return responseBuilder
//         .speak(messages.NOTIFY_MISSING_PERMISSIONS)
//         .withAskForPermissionsConsentCard([MOBILE_PERMISSION])
//         .getResponse();
//       }
//       console.log(JSON.stringify(error));
//       const response = responseBuilder.speak(messages.ERROR).getResponse();
//       return response;
//     }
//   },
// }

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
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
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const RequestLog = {
  process(handlerInput) {
    console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
  },
};

const ResponseLog = {
  process(handlerInput) {
    console.log(`RESPONSE BUILDER = ${JSON.stringify(handlerInput)}`);
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GreetMeIntentHandler,
    MyAllergenIsIntentHandler,
    // EmailIntentHandler,
    // MobileIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(RequestLog)
  .addResponseInterceptors(ResponseLog)
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda();
