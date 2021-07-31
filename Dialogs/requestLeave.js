const {
  ComponentDialog,
  WaterfallDialog,
  ChoicePrompt,
  ChoiceFactory,
  NumberPrompt,
  TextPrompt,
  DateTimePrompt, 
  ConfirmPrompt
} = require("botbuilder-dialogs");
const { CardFactory, ConsoleTranscriptLogger } = require("botbuilder");

const { requestLeave } = require("../Constants/dialogIDs");
const { confirmleave } = require("../cards/cards");
const { UserLeaves } = require("./userLeaves");
const { CancelAndHelpDialog } = require("./cancelAndHelpDialog")
// const { LuisRecognizer } = require("botbuilder-ai");

const requestLeaveWF1 = "requestLeaveWF1";
const ChoicePromptDialog = "ChoicePromptDialog";
const NumberPromptDialog = "NumberPromptDialog";
const TextPromptDialog = "TextPromptDialog";
const DateTimePromptDialog = "DateTimePrompt";
const ConfirmPromptDialog = "ConfirmPrompt";
const USER_LEAVES = "USER_LEAVES";


let totalLeaves = [];

let { leavebal } = require("../cards/cards");

class RequestLeave extends CancelAndHelpDialog {
  constructor(conversationState, userState) {
    super(requestLeave);

    if (!conversationState) throw new Error("conversation state also requried");

    this.conversationState = conversationState;
    this.userState = userState;
    this.applyLeaveStateAccessor =
      this.conversationState.createProperty("ApplyLeaveState");
    // this.applyLeaveStateAccessorUser = this.userState.createProperty('ApplyLeaveStateUser');

    this.userLeaves = this.userState.createProperty(USER_LEAVES);

    this.addDialog(new ChoicePrompt(ChoicePromptDialog));
    this.addDialog(new NumberPrompt(NumberPromptDialog));
    this.addDialog(new TextPrompt(TextPromptDialog));
    this.addDialog(new DateTimePrompt(DateTimePromptDialog));
    this.addDialog(new ConfirmPrompt(ConfirmPromptDialog));

    this.addDialog(
      new WaterfallDialog(requestLeaveWF1, [
        this.preProcessEntities.bind(this),
        this.typeOfLeave.bind(this),
        this.leaveDate.bind(this),
        this.noOfDays.bind(this),
        this.leaveReason.bind(this),
        this.applyApplication.bind(this),
        this.confirmLeave.bind(this),
        this.endDialog2.bind(this),
      ])
    );
   

    this.initialDialogId = requestLeaveWF1;
  }

  async preProcessEntities(stepContext) {
    try {
      if (stepContext.options && stepContext.options.luisResult) {

        let leavesNumberEntity = stepContext.options.entities.leavesNumber ? parseInt(stepContext.options.entities.leavesNumber[0].match(/\d+/),10): null;

        let leaveTypeEntity = stepContext.options.entities.leaveType? stepContext.options.entities.leaveType[0][0]: null;

        let dateTimeEntitity = stepContext.options.entities.datetimeV2? stepContext.options.entities.datetimeV2: null;
        let dateFrameObj = {};
        if (dateTimeEntitity != null) {
          dateTimeEntitity.forEach((subentities, index) => {
            if (subentities.type === 'duration')
              dateFrameObj['duration'] = subentities.values[0]["timex"].replace("P", "").replace("D", "");
            if (subentities.type === 'date')
              dateFrameObj['date'] = subentities.values[0]["resolution"][0]["value"]

          });
          
        }

        stepContext.values.Entities = {leaveTypeEntity,dateFrameObj,leavesNumberEntity};
        return stepContext.next();
      }
    } catch (err) {
      console.log(err);
    }
  }
  async typeOfLeave(stepContext) {

    if (!stepContext.values.Entities.leaveTypeEntity && stepContext.values.Entities.leaveTypeEntity == null) {
      return await stepContext.prompt(ChoicePromptDialog, {
        prompt:
          "Okay, what type of leave do you want me to apply for? Sick leave, Earned leave or Casual Leave.",
        choices: ChoiceFactory.toChoices([
          "Sick Leave",
          "Earned Leave",
          "Casual Leave",
        ]),
      });
    }
    else {
      return await stepContext.next(stepContext.values.Entities.leaveTypeEntity);
    }
  }

  async leaveDate(stepContext) {
    var dialogData = await this.applyLeaveStateAccessor.get(stepContext.context,{});
      
    if (stepContext.values.Entities.leaveTypeEntity && stepContext.values.Entities.leaveTypeEntity != null)
    {
      dialogData.leavetype = stepContext.values.Entities.leaveTypeEntity;
    }
    else {
      dialogData.leavetype = stepContext.result.value;
    }
    if ((stepContext.values.Entities.dateFrameObj) && (stepContext.values.Entities.dateFrameObj.date == undefined))
    {
      console.log('inside leaveDate')
      return await stepContext.prompt(
        TextPromptDialog, 
        "From which date do you desire a leave? Please enter date formate (yyyy-mm-dd) or just type day name..",
      );
    }
    else
    {
      return await stepContext.next(stepContext.values.Entities.dateFrameObj.date);
    }
  }

  async noOfDays(stepContext) {
    var dialogData = await this.applyLeaveStateAccessor.get(stepContext.context,{});
    if(stepContext.values.Entities.dateFrameObj && stepContext.values.Entities.dateFrameObj.date != null)
    {
      dialogData.leavedate = stepContext.values.Entities.dateFrameObj.date;
    }
    else
    {
      dialogData.leavedate = stepContext.result;
      console.log(stepContext.result);
    }
    console.log(stepContext.values.Entities.leavesNumberEntity);
    if ((!stepContext.values.Entities.leavesNumberEntity) && (stepContext.values.Entities.leavesNumberEntity == null)){
      return await stepContext.prompt(
        NumberPromptDialog,
        `Ok, leave start from ${dialogData.leavedate}. Till what time/duration you will be on leave?(Note: Please enter the number of days)`
      );
    }
    else{
      return await stepContext.next(stepContext.values.Entities.leavesNumberEntity);
    }
  }

  async leaveReason(stepContext) {
    var dialogData = await this.applyLeaveStateAccessor.get(
      stepContext.context,
      {}
    );
    if((stepContext.values.Entities.leavesNumberEntity) && (stepContext.values.leavesNumberEntity != null))
    {
      dialogData.leavedays = stepContext.values.Entities.leavesNumberEntity;
      console.log('leave days1')
      console.log(dialogData.leavedays)
    }
    
    else
    {
      dialogData.leavedays = stepContext.result;
      console.log('leave days2')
      console.log(stepContext.result)
     
    }
    console.log(dialogData.leavedays);
    if (dialogData.leavetype === "Sick Leave") {
      leavebal.sickLeave -= dialogData.leavedays;
    }
    if (dialogData.leavetype === "Casual Leave") {
      leavebal.casualLeave -= dialogData.leavedays;
    }
    if (dialogData.leavetype === "Earned Leave") {
      leavebal.earnedLeave -= dialogData.leavedays;
    }
    // console.log(leavebal);
    return await stepContext.prompt(
      TextPromptDialog,
      `Ok, leave period starts from ${dialogData.leavedate} for ${dialogData.leavedays} days. Please help me with the reason for which you are initiating leave request?`
    );
  }

  async applyApplication(stepContext) {
    var dialogData = await this.applyLeaveStateAccessor.get(stepContext.context,{});
    dialogData.leavereason = stepContext.result;
    await stepContext.context.sendActivity({
      attachments: [
        CardFactory.adaptiveCard(
          confirmleave(
            dialogData.leavetype,
            dialogData.leavedate,
            dialogData.leavedays,
            dialogData.leavereason
          )
        ),
      ],
    });
    return await stepContext.prompt(ChoicePromptDialog, {
      prompt: 'Please revert back with "yes" if you find this correct.',
      choices: ChoiceFactory.toChoices(["yes", "no"]),
    });
  }


  async confirmLeave(stepContext) {
    var dialogData = await this.applyLeaveStateAccessor.get(
      stepContext.context,
      {}
    );
    let tokenNum = Math.random().toString(36).substring(2).toUpperCase();
    dialogData.leaveconfirm = stepContext.result.value;
    dialogData.tokenNum = tokenNum;
    console.log(dialogData.tokenNum);

    const userLeaves = await this.userLeaves.get(
      stepContext.context,
      new UserLeaves()
    );

    userLeaves.leavetype = dialogData.leavetype;
    userLeaves.leavedays = dialogData.leavedays;
    userLeaves.leavedate = dialogData.leavedate;
    userLeaves.leavereason = dialogData.leavereason;
    userLeaves.tokenNum = dialogData.tokenNum;

    totalLeaves.push(userLeaves);

    if (dialogData.leaveconfirm === "yes") {
      await stepContext.context.sendActivity(
        "Ok! Please wait while I file your request."
      );

      await stepContext.context.sendActivity(
        `Your token numer for the request is ${dialogData.tokenNum}. You can check your leave application status by the help of this token number.`
      );
      console.log('line280' , stepContext.stack);
      
      console.log('request Leave', stepContext.options);
      
      if(stepContext.options.interrupt === true)
      {
        await stepContext.prompt(ConfirmPromptDialog,{
          prompt: 'Do you want to continue?'
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
    // else {
    //   return await stepContext.context.sendActivity("Sorry, couldnt get your query");
    // }
  }
  async endDialog2(stepContext)
  {
    return await stepContext.endDialog();
  }

}

module.exports.RequestLeave = RequestLeave;
module.exports.totalLeaves = totalLeaves;
