const {
  ComponentDialog,
  WaterfallDialog,
  ChoicePrompt,
  ChoiceFactory,
  NumberPrompt,
  TextPrompt,
  ConfirmPrompt
} = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");
const { deleteApplication, requestLeave } = require("../Constants/dialogIDs");

const deleteApplicationWF1 = "deleteApplicationWF1";
const ChoicePromptDialog = "ChoicePromptDialog";
const NumberPromptDialog = "NumberPromptDialog";
const TextPromptDialog = "TextPromptDialog";
const ConfirmPromptDialog = "ConfirmPrompt";

const { leavestatus } = require("../cards/cards");
const { UserLeaves } = require("./userLeaves");
const { CancelAndHelpDialog } = require("./cancelAndHelpDialog")
const USER_LEAVES = "USER_LEAVES";

let totalLeaves = require("./requestLeave");

class DeleteApplication extends CancelAndHelpDialog {
  constructor(conversationState, userState) {
    super(deleteApplication);
    this.conversationState = conversationState;
    this.userState = userState;
    this.applyLeaveStateAccessor =
      this.conversationState.createProperty("ApplyLeaveState");
    // this.applyLeaveStateAccessorUser = this.userState.createProperty('ApplyLeaveStateUser');

    this.userLeaves = this.userState.createProperty(USER_LEAVES);

    this.addDialog(new ChoicePrompt(ChoicePromptDialog));
    this.addDialog(new NumberPrompt(NumberPromptDialog));
    this.addDialog(new TextPrompt(TextPromptDialog));
    this.addDialog(new ConfirmPrompt(ConfirmPromptDialog));
    this.addDialog(
      new WaterfallDialog(deleteApplicationWF1, [
        // this.preProcessEntities.bind(this),
        this.sendCard.bind(this),
        this.confirm.bind(this),
        this.confirmDelete.bind(this),
        this.endDialog2.bind(this,)
      ])
    );

    this.initialDialogId = deleteApplicationWF1;
  }

  async preProcessEntities(stepContext) {
    try {
      if (stepContext.options && stepContext.options.luisResult) {
        console.log("hello3");
        console.log(JSON.stringify(stepContext.options.entities));

        let tokenNumEntity = stepContext.options.entities.tokenNum ? stepContext.options.entities.tokenNum[0]: null;
        console.log(tokenNumEntity);

        stepContext.values.Entities = {tokenNumEntity};
        console.log(stepContext.values.Entities);
        return stepContext.next();
      }
    } catch (err) {
      console.log(err);
    }
  }
  async sendCard(stepContext) {
    console.log(totalLeaves.totalLeaves.length);
    if (totalLeaves.totalLeaves.length == 0) {
      await stepContext.context.sendActivity(
        `You don't have any leave applications to delete, you can apply one.`
      );
      return await stepContext.context.sendActivity({
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
    } else {
      const leaveTypeArray = totalLeaves.totalLeaves.map((el) => {
        return {
          type: "TextBlock",
          wrap: true,
          text: el.leavetype,
          horizontalAlignment: "Left",
          $data: "dataDialog",
        };
      });

      const leaveDaysArray = totalLeaves.totalLeaves.map((el) => {
        return {
          type: "TextBlock",
          wrap: true,
          text: JSON.stringify(el.leavedays),
          horizontalAlignment: "Left",
          $data: "dataDialog",
        };
      });

      const leaveDateArray = totalLeaves.totalLeaves.map((el) => {
        return {
          type: "TextBlock",
          wrap: true,
          text: el.leavedate,
          horizontalAlignment: "Left",
          $data: "dataDialog",
        };
      });

      const leaveReasonArray = totalLeaves.totalLeaves.map((el) => {
        return {
          type: "TextBlock",
          wrap: true,
          text: el.leavereason,
          horizontalAlignment: "Left",
          $data: "dataDialog",
        };
      });

      const leaveTokenNumArray = totalLeaves.totalLeaves.map((el) => {
        return {
          type: "TextBlock",
          wrap: true,
          text: el.tokenNum,
          horizontalAlignment: "Left",
          $data: "dataDialog",
        };
      });
      const leaveStatusArray = totalLeaves.totalLeaves.map((el) => {
        return {
          type: "TextBlock",
          wrap: true,
          text: "Under Process",
          horizontalAlignment: "Left",
          $data: "dataDialog",
        };
      });
      await stepContext.context.sendActivity({
        attachments: [
          CardFactory.adaptiveCard(
            leavestatus(
              leaveTypeArray,
              leaveDaysArray,
              leaveDateArray,
              leaveReasonArray,
              leaveTokenNumArray,
              leaveStatusArray
            )
          ),
        ],
      });
      return await stepContext.prompt(
        TextPromptDialog,
        `Please enter the Leave Application Token number from the list.`
      );
    }
  }

  async confirm(stepContext) {
    var dialogData = await this.userLeaves.get(stepContext.context, {});
      dialogData.tokenSelected = stepContext.result;

    return await stepContext.prompt(ChoicePromptDialog, {
      prompt: 'Please revert back with "yes" if you find this correct.',
      choices: ChoiceFactory.toChoices(["yes", "no"]),
    });
  }

  async confirmDelete(stepContext) {
    var dialogData = await this.userLeaves.get(stepContext.context);
    dialogData.confirmVal = stepContext.result.value;

    const userLeaves = await this.userLeaves.get(
      stepContext.context,
      new UserLeaves()
    );
    if (dialogData.confirmVal === "yes") {

      for (var i = 0; i < totalLeaves.totalLeaves.length; i++) {
        if (dialogData.tokenSelected === totalLeaves.totalLeaves[i].tokenNum) {
          await stepContext.context.sendActivity(
            `Leave Application with token number ${dialogData.tokenSelected} has been deleted.`
          );
          totalLeaves.totalLeaves.splice(totalLeaves.totalLeaves[i], 1);
          break;
        }
        
      }
    } else if (dialogData.confirmVal === "no") {
      await stepContext.context.sendActivity(
        `Leave Application with token number ${dialogData.tokenSelected} will not be deleted.`
      );
    } else {
      await stepContext.context.sendActivity(`Sorry, couldn't get your query`);
    }
    console.log(stepContext.options.interrupt);
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
    return await stepContext.endDialog();
  }
}

module.exports.DeleteApplication = DeleteApplication;
