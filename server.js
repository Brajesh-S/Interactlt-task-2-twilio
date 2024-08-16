const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { handleVoiceCall, handleGatherInput } = require('./twilioHandlers');
const { createCall } = require('./twilioHandlers');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static(path.join(__dirname)));


app.post('/voice', handleVoiceCall);


app.post('/gather', handleGatherInput);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    createCall();
});
