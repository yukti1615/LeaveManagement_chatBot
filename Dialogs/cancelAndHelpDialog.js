// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { InputHints } = require('botbuilder');
const { ComponentDialog, DialogTurnStatus } = require('botbuilder-dialogs');
const { CardFactory } = require("botbuilder");
const {rootDialog,deleteApplication, requestLeave, leaveBalance,leaveStatus,recharge } = require("../Constants/dialogIDs");
/**
 * This base class watches for common phrases like "help" and "cancel" and takes action on them
 * BEFORE they reach the normal bot logic.
 */
class CancelAndHelpDialog extends ComponentDialog {
    async onContinueDialog(innerDc) {
        const result = await this.interrupt(innerDc);
        if (result) {
            return result;
        }
        return await super.onContinueDialog(innerDc);
    }

    async interrupt(innerDc) {
        if (innerDc.context.activity.text) {
            const text = innerDc.context.activity.text.toLowerCase();
            const button = innerDc.context.activity.text;

            console.log(button)
            switch (button) {
            
            case 'help':
            case '?': {
                const helpMessageText = 'Show help here';
                await innerDc.context.sendActivity(helpMessageText, helpMessageText, InputHints.ExpectingInput);
                await innerDc.context.sendActivity('For more queries visit : https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-handle-user-interrupt?view=azure-bot-service-4.0&tabs=javascript')
                return { status: DialogTurnStatus.waiting };
            }

            case 'Request Leave':
            case 'Leave Balance':
            case 'Leave Application Status':
            case 'Delete Leave Application':
            case 'Recharge':
              {
                console.log('line49')
                console.log('InnerDc->', innerDc);
                await innerDc.beginDialog(rootDialog, {
                  interrupt:true,
                })
                return { status: DialogTurnStatus.waiting};
              }
            case "No":
              await innerDc.cancelAllDialogs();
              await innerDc.context.sendActivity('How may I help you further? ');
              return await innerDc.context.sendActivity({
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
            case "Yes":
              return await innerDc.continueDialog();    
            case 'cancel':
            case 'quit': {
                const cancelMessageText = 'Cancelling...';
                await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                await innerDc.context.sendActivity({
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
                        ])
                      ),
                    ],
                  });
                return await innerDc.cancelAllDialogs();
            }
            }
        }
    }
}

module.exports.CancelAndHelpDialog = CancelAndHelpDialog;
