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
		return (
			request.type === 'LaunchRequest' ||
			(request.type === 'IntentRequest' &&
				request.intent.name === 'GetJokeHandler')
		);
	},

	async handle(handlerInput) {
		const res = await getDetails();

		if (res.status === 200) {
			const ingredients = res.product[0].ingredients;

			var flag = false;

			const usersAllergy = ['nuts', 'milk']; //this will come from NoSQL DB in array form

			ingredients.forEach((e_1) => {
				usersAllergy.forEach((e_2) => {
					if (e_1 === e_2) {
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
			console.log(flag);

			if (flag) {
				const speakOutput = 'You cannot have this product'; //tell user that he can or cannot have the product
				return handlerInput.responseBuilder
					.speak(speakOutput)
					.reprompt('Abc')
					.getResponse();
			} else {
				const speakOutput = 'You can have this product'; //tell user that he can or cannot have the product
				return handlerInput.responseBuilder
					.speak(speakOutput)
					.reprompt('abc')
					.getResponse();
			}
		} else {
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
	return new Promise((resolve, reject) => {
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

		Request.get(`https://dietary-care.herokuapp.com/${product}`, function (
			err,
			res,
			body
		) {
			if (err) {
				reject(err);
			}

			const data = JSON.parse(body);
			resolve(data);
		});
	});
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
		return (
			request.type === 'IntentRequest' &&
			request.intent.name === 'AMAZON.HelpIntent'
		);
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
		return (
			request.type === 'IntentRequest' &&
			(request.intent.name === 'AMAZON.CancelIntent' ||
				request.intent.name === 'AMAZON.StopIntent')
		);
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder.speak(STOP_MESSAGE).getResponse();
	},
};

const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'SessionEndedRequest';
	},
	handle(handlerInput) {
		console.log(
			`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`
		);

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
const GET_FACT_MESSAGE = "Here's your Training Question: ";
const HELP_MESSAGE =
	'You can say tell me a Training Question, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = [
	'Doha Bank has tied up with Reliance group to generate business opportunities in the Gulf Cooperation Council nations and India.',
	'Arvind Panagriya has been appointed as the Sherpa for G-20 talks in place of Railway Minister Suresh Prabhu by union government.',
	'Srigupta was the first known Gaytan ruler.',
	'Muhammad Shah was the last Mughal emperor to sit on the peacock throne.',
	'Prakrit was the official language of the Satavahanas',
	'Santhara a Jainism ritual, is declared illegal by Rajasthan High Court.',
	'September 29 is World Heart day observed every year across the globe',
	'Sikkim has been declared as the first Organic State of India',
	'The term ‘Performance Budget’ was coined by First Hoover Commission of USA',
	'Audit of State Government is a Union subject.',
	'In 1964 year was the Committee on Public Undertakings constituted by the Lok Sabha',
	'The number of demands in the general budget for civil expenditure is 103',
	'The C & AG of India does not audit the receipts and expenditure of Municipal undertakings',
	'The Railway Budget was separated from the Central Budget in the year 1921.',
	'The role of the Finance Commission in Central-State fiscal relations has been undermined by The State Governments.',
	'The Chairman of the Public Accounts Committee of the Parliament is appointed by Speaker of Lok Sabha.',
	'The question asked orally after the question hour in the House is called Starred question',
	'L. K. Jha was the Chairman of the Economic Reforms Commission (1981-84).',
	'‘Position classification’ is the classification of Duties.',
	'The civil service was defined as “professional body of officials, permanent, paid and skilled” by Herman Finer.',

	'A new All India Service can be created by a resolution under Article 312 of the Constitution.',
	'The British concept of Civil Service neutrality is laid down by Masterman Committee.',
	'The ‘spoils system’ in the USA began during the period of Jackson.',
	'The Union Public Service Commission of India has been established under the Article 315.',
	'‘Efficiency record’ method for determining the merit for promotion is practised in USA.',
	'“Officials make work for each other.” This was said by Parkinson.',
	'Constitutional Safeguards to civil servants in India are ensured by Article 311.',
	'Rajya Sabha in India consists of 250 members.',
	'1/6th many members are nominated to the State Legislative Council by the Governor.',
	'The Public Corporation is Accountable to Parliament.',
	'The grants made in advance by the Lok Sabha in respect of estimated expenditure is called Vote on account.',
	'Impeachment proceedings against the President for violation of the Constitution can be initiated in Either House of Parliament.',
	'The term ‘Federation’ has been Nowhere used in the Indian Constitution.',
	'The principal function of Directorates in a State Government is to Undertake policy implementation.',
	'The District treasury comes under the control of the District Collector.',
	'Ashok Mehta Committee recommended for the establishment of Mandal Panchayat.',
	'The first municipal corporation in India was set-up at Madras in the year of 1687.',
	'Family is not considered as part of the Civil Society.',
	'Mahatma Gandhi conceived the concept of Gram Swaraj.',
	'The Lokayukta and Uplokayuktas Act was first passed in Orissa.',
	'Eleventh Schedule of the Constitution relating to the Panchayats contains 29 items.',
	'The ‘Recall’ provision to remove the elected office-bearers from the local self-government institution has been executed in Madhya Pradesh.',
	'Nagaland does not have Panchayati Raj Institution at all.',
	'The working principle of a washing machine is centrifugation.',
	'Selenium, a non-metal is a good conductor of electricity.',
	'In human body, Parathyroid hormone regulates blood calcium and phosphate.',
	'The proteinous part of the enzyme is called Apoenzyme.',
	'In the structure of planet. Earth, below the mantle, the core is mainly made up of Iron.',
	'Radioactivity is measured by Geiger-Muller counter.',
	'‘Good Governance’ and ‘Participating Civil Society for Development’ were stressed in World Bank Report of 1992.',
	'If the administrative authority within a department is vested in a single individual, then that system is known as Bureau.',
	'M. P. Follett has analysed the leadership in terms of ‘circular response’.',
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
