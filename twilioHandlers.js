const twilio = require('twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
require('dotenv').config();

// Twilio account credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; 

const client = twilio(accountSid, authToken);

// Function to handle the initial voice call
const handleVoiceCall = (req, res) => {
    const twiml = new VoiceResponse();

    // Play the provided MP3 file
    twiml.play('http://localhost:3000/static/your-audio-file.mp3'); // Replace with the actual URL to your MP3 file

    // Gather input from the user
    const gather = twiml.gather({
        numDigits: 1,
        action: '/gather', // Route to handle the response
        method: 'POST',
    });

    // Provide the user with options
    gather.say('Press 1 to receive your personalized interview link via SMS.');

    // If no input was sent, redirect to this route
    twiml.redirect('/voice');

    res.type('text/xml');
    res.send(twiml.toString());
};

// Function to handle the user's input
const handleGatherInput = (req, res) => {
    const twiml = new VoiceResponse();

    // Check the user's input
    if (req.body.Digits == '1') {
        // Send the personalized interview link via SMS
        client.messages.create({
            body: 'Here is your personalized interview link: https://v.personaliz.ai/?id=9b697c1a&uid=fe141702f66c760d85ab&mode=test',
            from: twilioPhoneNumber,
            to: '+919384631627', // Replace with the recipient's phone number
        }).then(message => console.log('Message sent:', message.sid))
          .catch(error => console.error('Error sending message:', error));

        // Notify the user that the SMS has been sent
        twiml.say('The interview link has been sent to your phone via SMS. Thank you.');
    } else {
        // Handle other inputs or no input
        twiml.say("Sorry, I don't understand that choice.");
        twiml.redirect('/voice');
    }

    res.type('text/xml');
    res.send(twiml.toString());
};

// Function to initiate the call
const createCall = async () => {
    try {
        const call = await client.calls.create({
            from: twilioPhoneNumber,
            to: '+919384631627',
            url: 'http://localhost:3000/voice', // Local URL for testing
        });

        console.log('Call SID:', call.sid);
    } catch (error) {
        console.error('Error making call:', error);
    }
};

// Export functions to be used in the server
module.exports = {
    handleVoiceCall,
    handleGatherInput,
    createCall
};
