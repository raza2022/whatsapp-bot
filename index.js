const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const client = new Client();

client.on('qr', (qr) => {
   qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
})

client.initialize();

const configuration  = new Configuration({
    apiKey: process.env.OPEN_API_KEY
});

const openAi = new OpenAIApi(configuration);

client.on('message', message => {
    console.log(message?.body)

    if(message.body.startsWith('#')) {
        runCompletion(message?.body.substring(1)).then(result => message.reply(result));
    }
});

async function runCompletion (message) {
    const completion = await openAi.createCompletion(({
        model: 'text-davinci-003',
        promps: message,
        max_tokens: 200,
    }))
    return completion?.data.choices[0].text;
}


















