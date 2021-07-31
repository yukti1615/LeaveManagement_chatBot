
const {ComponentDialog, WaterfallDialog, ChoicePrompt, ChoiceFactory, NumberPrompt, TextPrompt, ConfirmPrompt} = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');

const { leaveBalance } = require('../Constants/dialogIDs');
const { leavebalance} = require('../cards/cards')
const { CancelAndHelpDialog } = require("./cancelAndHelpDialog")
const { dialogData } = require('./requestLeave')
const ConfirmPromptDialog = "ConfirmPrompt";

// const dialogdata = 'dialogData'; 
const leaveBalanceWF1 = 'leaveBalanceWF1';
let {leavebal} = require('../cards/cards')
class LeaveBalance extends CancelAndHelpDialog{
    constructor(conversationState){
        super(leaveBalance);

        if(!conversationState) throw new Error('conversation state also requried');
        this.conversationState = conversationState;

        this.addDialog(new ConfirmPrompt(ConfirmPromptDialog));
        this.addDialog(new WaterfallDialog(leaveBalanceWF1, [
            this.balanceLeave.bind(this),
            this.endDialog2.bind(this),
        ]));

        this.initialDialogId = leaveBalanceWF1;
    }

    async balanceLeave(stepContext){
        await stepContext.context.sendActivity('Sure allow me to fetch your data.');
        await stepContext.context.sendActivity({
            attachments:[
                CardFactory.adaptiveCard(leavebalance(leavebal))
            ]  
        })
        if(stepContext.options.interrupt === true)
        {
            await stepContext.prompt(ConfirmPromptDialog,{
              prompt: 'Do you want to continue the previous conversation?'
            })
        }
            
        else{
        await stepContext.context.sendActivity('May I help you further?')
        await stepContext.context.sendActivity({
          attachments: [
            CardFactory.heroCard(
              "Here are some suggestions: ",
              null,
              CardFactory.actions([
                {
                  type: "imBack",
                  title: "Request Leave",
                  value: "Request Leave",
                },
                {
                  type: "imBack",
                  title: "Leave Balance",
                  value: "Leave Balance",
                },
                {
                  type: "imBack",
                  title: "Leave Application Status",
                  value: "Leave Application Status",
                },
                {
                  type: "imBack",
                  title: "Delete Leave Application",
                  value: "Delete Leave Application",
                },
                {
                  type: 'imBack',
                  title: 'Recharge',
                  value: 'Recharge'
                }
              ])
            ),
          ],
        });
        return await stepContext.next();
        }      
        
    }
    async endDialog2(stepContext)
    {
        try{
            return stepContext.endDialog();
        }
        catch(err){
            console.log(err);
        }
    }
}
module.exports.LeaveBalance = LeaveBalance;