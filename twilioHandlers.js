const twilio = require("twilio");
const VoiceResponse = require("twilio").twiml.VoiceResponse;
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const handleVoiceCall = (req, res) => {
  console.log("Voice call initiated");
  const twiml = new VoiceResponse();

  twiml.play(
    "https://d88b-2405-201-d006-8011-7018-6d4a-5851-702b.ngrok-free.app/static/audio.mp3"
  );

  const gather = twiml.gather({
    numDigits: 1,
    action: "/gather",
    method: "POST",
  });

  // If no input was sent, redirect to this route
  twiml.redirect("/voice");

  console.log("Sending TwiML response:", twiml.toString());

  res.type("text/xml");
  res.send(twiml.toString());
};

const handleGatherInput = (req, res) => {
  const twiml = new VoiceResponse();

  if (req.body.Digits === "1") {
    twiml.say(
      "The interview link has been sent to your phone via SMS. Thank you."
    );

    client.messages
      .create({
        body: "Here is your personalized interview link: https://v.personaliz.ai/?id=9b697c1a&uid=fe141702f66c760d85ab&mode=test",
        from: twilioPhoneNumber,
        to: "+919384631627",
      })
      .then((message) => {
        console.log("Message sent:", message.sid);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  } else if (req.body.Digits === "2") {
    twiml.say("Thank you for your response.");
  } else {
    twiml.say("Sorry, I don't understand that choice.");
    twiml.redirect("/voice");
  }

  twiml.hangup();
  res.type("text/xml");
  res.send(twiml.toString());
};
const createCall = async () => {
  try {
    const call = await client.calls.create({
      from: twilioPhoneNumber,
      to: "+919384631627",
      url: "https://d88b-2405-201-d006-8011-7018-6d4a-5851-702b.ngrok-free.app/voice", // Local URL for testing
    });

    console.log("Call SID:", call.sid);
  } catch (error) {
    console.error("Error making call:", error);
  }
};

module.exports = {
  handleVoiceCall,
  handleGatherInput,
  createCall,
};
