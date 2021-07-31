
const {ActivityHandler, CardFactory} = require('botbuilder')
const{ welcomeCard } = require('./cards/cards')


class BotActivityHandler extends ActivityHandler {
        /**
         *
         * @param {ConversationState} conversationState
         * @param {UserState} userState
         * @param {Dialog} dialog
         */
    constructor(conversationState, userState, rootDialog)
    {
        
        super();
        if(!conversationState) throw new Error("Conversation state required.")
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        
        this.conversationState = conversationState;
        this.userState = userState;
        this.rootDialog = rootDialog;
        this.accessor = this.conversationState.createProperty('DialogAccessor');


        //message event
        // event triggered everytime when user send message to bot
        //activity handler arguement
        // we have to explicitly define where does bot have to go for next mwssage;
        this.onMessage(async (context, next) =>{
            await this.rootDialog.run(context, this.accessor)
            // const recognizerResult = await dispatchRecognizer.recognize(dc, context.activity);
            await next();
        });

        //event is triggereed when member is also user and 
        // to send card we use partial activity as a context

        this.onConversationUpdate(async(context, next) =>{
           
            if(context.activity.membersAdded && context.activity.membersAdded[1].id == context.activity.from.id){
                
                // heroCard 3 arg- title, image, button
                await context.sendActivity({
                    attachments:[
                        CardFactory.adaptiveCard(welcomeCard())
                    ]  
                })
                await context.sendActivity({
                    attachments: [
                        CardFactory.heroCard(
                            'Here are some suggestions: ',
                            null,
                            CardFactory.actions([
                                {
                                    type: 'imBack',
                                    title: 'Request Leave',
                                    value: 'Request Leave'
                                },
                                {
                                    type: 'imBack',
                                    title: 'Leave Balance',
                                    value: 'Leave Balance'
                                },
                                {
                                    type: 'imBack',
                                    title: 'Leave Application Status',
                                    value: 'Leave Application Status'
                                },
                                {
                                    type: 'imBack',
                                    title: 'Delete Leave Application',
                                    value: 'Delete Leave Application'
                                },
                                {
                                    type: 'imBack',
                                    title: 'Recharge',
                                    value: 'Recharge'
                                }
                            ])
                        )
                    ]
                });
            }
            await next();
            
        });
     }

    //to trigger above we event we have to pass method to this class run method

    async run(context) {
        await super.run(context);
        await this.conversationState.saveChanges(context,false);
        await this.userState.saveChanges(context,false);
    }
}

module.exports.BotActivityHandler = BotActivityHandler;