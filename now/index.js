var Twilio = require('twilio');
const { parse } = require('url');

module.exports = (request, response) => {
  console.log('Started');
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = Twilio(accountSid, authToken);

  const { query } = parse(request.url, true);
  console.log(query);

  client.messages
    .create({
      from: '+37259120139',
      body: query.message,
      to: query.to,
    })
    .then(() => response.end(`Message sent to ${query.to}`))
    .catch(error => response.end(error));
};
