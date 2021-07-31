

const restify = require('restify')

const { BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } = require('botbuilder')


const { RootDialog } = require('./Dialogs/RootDialog')

const { BotActivityHandler } = require('./BotActivityHandler')
// adapter init 

// const { RootDialog } = require('../Dialogs/RootDialog')

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
}); // for local development we dont need that




//adapter error handler

adapter.onTurnError = async(context, error) =>
{
    console.log("error occured => ", error);

    //send message to user about the error

    await context.sendActivity('Bot encountered an error'); 
    // context has function called sendActivity and it takes string as a argument.
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
    // Clear out state
    await conversationState.delete(context);
};


//create server

let server = restify.createServer();
server.listen(3978, () =>{
    console.log(`${server.name} listening to ${server.url}`);
})

const memory = new MemoryStorage(); 
let conversationState = new ConversationState(memory);
let userState = new UserState(memory);

//activity handler object

// const rootDialog = new RootDialog(conversationState);
const rootDialog = new RootDialog(conversationState, userState);
const mainBot = new BotActivityHandler(conversationState,userState, rootDialog);


server.post('/api/messages', (req, res) =>{
    adapter.processActivity(req,res, async(context) => {
        await mainBot.run(context);
    }); // process all activities coming from user
});