import * as functions from 'firebase-functions';
import * as Twilio from 'twilio';

export const messages = functions.https.onRequest((request, response) => {
 const accountSid = functions.config().twilio.account.sid;
 const authToken = functions.config().twilio.auth.token;
 const client = Twilio(accountSid, authToken);

 console.log(request.query.message, request.query.to);

 client.messages
     .create({from: '+37259120139', body: request.query.message, to: request.query.to})
     .then(message => response.send(message))
     .catch(error => response.send(error));
});
