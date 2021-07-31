const {
  ComponentDialog,
  WaterfallDialog,
  ChoicePrompt,
  ChoiceFactory,
  NumberPrompt,
  TextPrompt,
  ConfirmPrompt,
} = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");

const { leaveStatus } = require("../Constants/dialogIDs");
const { leavestatus } = require("../cards/cards");
const { UserLeaves } = require("./userLeaves");
const { CancelAndHelpDialog } = require("./cancelAndHelpDialog")
const ConfirmPromptDialog = "ConfirmPrompt";

let totalLeaves = require("./requestLeave");


const USER_LEAVES = "USER_LEAVES";
const leaveStatusWF1 = "leaveStatusWF1";

class LeaveStatus extends CancelAndHelpDialog {
  constructor(conversationState, userState) {
    super(leaveStatus);

    if (!conversationState) throw new Error("conversation state also requried");
    this.conversationState = conversationState;
    this.userState = userState;
    this.applyLeaveStateAccessor =
      this.conversationState.createProperty("ApplyLeaveState");
    this.userLeaves = userState.createProperty(USER_LEAVES);

    this.addDialog(new ConfirmPrompt(ConfirmPromptDialog));

    this.addDialog(
      new WaterfallDialog(leaveStatusWF1, [
        this.statusLeave.bind(this),
        this.endDialog2.bind(this),
      ])
    );

    this.initialDialogId = leaveStatusWF1;
  }

  async statusLeave(stepContext) {
    const userLeaves = await this.userLeaves.get(
      stepContext.context,
      new UserLeaves()
    );

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

    if (totalLeaves.totalLeaves.length == 0) {
      await stepContext.context.sendActivity("You have no leave applications.");
    } else {
      await stepContext.context.sendActivity(
        "Please wait while I process your request."
      );
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
    }

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

module.exports.LeaveStatus = LeaveStatus;
