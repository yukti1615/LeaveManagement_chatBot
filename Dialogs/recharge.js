const { MessageFactory, CardFactory } = require('botbuilder');
const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, ChoiceFactory, NumberPrompt,ChoicePrompt, TextPrompt, ConfirmPrompt } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require("./cancelAndHelpDialog")
const { Channels } = require('botbuilder-core');
const { recharge } = require('../Constants/dialogIDs')
const WATERFALL_DIALOG = 'CERTIFICATE_DIALOG';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const ConfirmPromptDialog = "ConfirmPromptDialog";
const CHOICE_PROMPT = 'CHOICE_PROMPT';
class RechargeDialog extends CancelAndHelpDialog {

    constructor(userState, conversationState) {

        super(recharge);
        this.conversationState = conversationState;
        this.userState = userState;
        this.rechargeStateAccessor = this.conversationState.createProperty("rechargeState");

        this.addDialog(new TextPrompt(NAME_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new ConfirmPrompt(ConfirmPromptDialog));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [

            this.addRechargeProvider.bind(this),
            this.amountOfRecharge.bind(this),
            this.getPhoneNumber.bind(this),
            this.RechargeProvider.bind(this),
            this.sendConfirmation.bind(this), 
            this.endDialog1.bind(this),
        ]));
        this.initialDialogId = WATERFALL_DIALOG;

    }

    async addRechargeProvider(stepContext) {

        try {
            return await stepContext.prompt(CHOICE_PROMPT, {
              prompt:
                "Please choose name of your service provider:  ",
              choices: ChoiceFactory.toChoices([
                "Airtel",
                "Aircel",
                "Jio",
                "Vodafone"
              ]),
            });
            
        } catch (error) {
            console.log(error);
        }
    }
    async amountOfRecharge(stepContext) {

        try {
          let dialogData = await this.rechargeStateAccessor.get(stepContext.context, {});
          stepContext.values.provider = stepContext.result.value;
          dialogData.provider = stepContext.values.provider;
          return await stepContext.prompt(NUMBER_PROMPT, "Enter the recharge amount :");
    
        } catch(error){
          console.log(error);
    
        }
    
      }
    async getPhoneNumber(stepContext)
    {
        try {
           let dialogData = await this.rechargeStateAccessor.get(stepContext.context);
            dialogData.amountVal = stepContext.result;
            return await stepContext.prompt(NUMBER_PROMPT, 'Please enter your Phone Number!');

        } catch (error) {

            console.log(error);

        }
    }

    async RechargeProvider(stepContext)
    {
      try
      {
        let dialogData = await this.rechargeStateAccessor.get(stepContext.context);
        dialogData.Phno = stepContext.result;
        return await stepContext.prompt(CHOICE_PROMPT, {
          prompt:
            "Choose Payment method: ",
          choices: ChoiceFactory.toChoices([
            "Paytm",
            "Net Banking",
            "Credit Card",
            "Debit Card"
          ]),
        });
      }
      catch{
        console.log(error);
      }
    }

    async sendConfirmation(stepContext) {
        try {
            let dialogData = await this.rechargeStateAccessor.get(stepContext.context);
            dialogData.rechargeProvider = stepContext.result.value;
            await stepContext.context.sendActivity(
                `Your Request of Recharge amount ${dialogData.amountVal} for 
                ${dialogData.Phno} by ${dialogData.provider} is successful by payment method ${dialogData.rechargeProvider}.`
            )
            console.log(stepContext.options.interrupt === true);
            console.log('Recharge', stepContext.options);
          
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
            
        } catch (error) {
            console.log(error);
        }
        
        
    }
    async endDialog1(stepContext)
    {
      return await stepContext.endDialog();
    }
}

module.exports.RechargeDialog = RechargeDialog;