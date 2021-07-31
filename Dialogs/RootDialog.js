const {
  ComponentDialog,
  WaterfallDialog,
  DialogSet,
  DialogTurnStatus,
} = require("botbuilder-dialogs");

const {
  rootDialog,
  requestLeave,
  leaveStatus,
  leaveBalance,
  deleteApplication,
  recharge,
} = require("../Constants/dialogIDs");
const { LuisRecognizer, QnAMaker } = require("botbuilder-ai");
const { RequestLeave } = require("./requestLeave");
const { LeaveStatus } = require("./leaveStatus");
const { LeaveBalance } = require("./leaveBalance");
const { DeleteApplication } = require("./deleteApplication");
const { RechargeDialog } = require("./recharge");
const { dialogData } = require("./requestLeave");
// const dialogdata = 'dialogData';
const parseMessage = "parseMessage";
const dialogStack = [];


const luisConfig = {
  applicationId: process.env.LUISapplicationId,
  endpointKey: process.env.LUISendpointKey,
  endpoint: "https://manipal-interns-luis.cognitiveservices.azure.com/",
};

const qnaMaker = new QnAMaker({
  knowledgeBaseId: process.env.QNAknowledgeBaseId ,
  endpointKey: process.env.QNAendpointKey,
  host: "https://firstqabot.azurewebsites.net/qnamaker",
});


const dispatchConfig = {
  applicationId: process.env.DISPATCHapplicationId,
  endpointKey: process.env.DISPATCHendpointKey,
  endpoint:
    "https://manipal-interns-luis.cognitiveservices.azure.com/",
};

class RootDialog extends ComponentDialog {
  constructor(conversationState, userState) {
    super(rootDialog);
    if (!conversationState) throw new Error("conversation state also requried");
    this.conversationState = conversationState;
    this.userState = userState;
    this.dialogState = conversationState.createProperty("dialogState");
    // this.requestLeave = new RequestLeave(this.conversationState,this.userState);
    // this.cancelReservationDialog = new CancelReservationDialog(this.conversationState,this.userState);

    this.addDialog(
      new WaterfallDialog(parseMessage, [this.routeMessage.bind(this)])
    );

    this.recognizer = new LuisRecognizer(luisConfig, {
      apiVersion: "v3",
    });
    this.dispatchRecognizer = new LuisRecognizer(dispatchConfig, {
      apiVersion: "v3",
    });
    this.qnaMaker = qnaMaker;

  
    this.addDialog(new RequestLeave(conversationState, userState));
    this.addDialog(new LeaveStatus(conversationState, userState));
    this.addDialog(new LeaveBalance(conversationState));
    this.addDialog(new DeleteApplication(conversationState, userState));
    this.addDialog(new RechargeDialog(userState, conversationState));
    this.initialDialogId = parseMessage;
  }

  async run(context, accessor) {
    try {
      const dialogSet = new DialogSet(accessor); //to hold all dialog ids we create a new dialog set
      dialogSet.add(this); // refers to current reference object
      const dialogContext = await dialogSet.createContext(context); // hold specific context of that particular dialog
      const results = await dialogContext.continueDialog(); //
      if (results && results.status == DialogTurnStatus.empty) {
        await dialogContext.beginDialog(this.id);

      }
       else {
        console.log("dialog stack is empty");
      }
    } catch (err) {
      console.log(err);
    }
  }


  async routeMessage(stepContext) {

    let dispatchResponse = await this.dispatchRecognizer.recognize(stepContext.context);
    let dispatchIntent = dispatchResponse.luisResult.prediction.topIntent;
    console.log('dispatch Response is: ', dispatchResponse);
    console.log('dispatch intent is: ', dispatchIntent);

    switch(dispatchIntent)
    {
      case 'luis_yukti':
        {
          console.log('inside leave mgmt');
          let luisresponse = await this.recognizer.recognize(stepContext.context);
          let luisIntent = luisresponse.luisResult.prediction.topIntent;
          // console.log(JSON.stringify(luisresponse.luisResult.prediction));
      
          if(stepContext.options && stepContext.options.interrupt)
          {
            switch (luisIntent) {
              case "requestLeave":
                return await stepContext.beginDialog(requestLeave, {
                  luisResult: true,
                  entities: luisresponse.luisResult.prediction.entities,
                  interrupt:true,
                  // stack: stack[0],
                  
                });
              case "leaveBalance":
                return await stepContext.beginDialog(leaveBalance ,{
                  luisResult: true,
                  entities: luisresponse.luisResult.prediction.entities,
                  interrupt:true,
      
                });
              case "leaveStatus":
                return await stepContext.beginDialog(leaveStatus,{
                  luisResult: true,
                  entities: luisresponse.luisResult.prediction.entities,
                  interrupt:true,
      
                });
              case "deleteLeave":
                return await stepContext.beginDialog(deleteApplication,{
                  luisResult: true,
                  entities: luisresponse.luisResult.prediction.entities,
                  interrupt:true,
      
                });
              case "recharge":
                return await stepContext.beginDialog(recharge,{
                  luisResult: true,
                  entities: luisresponse.luisResult.prediction.entities,
                  interrupt:true,
      
                })
              default:
                await stepContext.context.sendActivity("Sorry, couldnt get your query");
            }
          }
          else {
            switch (luisIntent) {
              case "requestLeave":
                return await stepContext.beginDialog(requestLeave, {
                  luisResult: true,
                  entities: luisresponse.luisResult.prediction.entities,
                  
                });
              case "leaveBalance":
                return await stepContext.beginDialog(leaveBalance ,{
                  luisResult: true,
                  entities: luisresponse.luisResult.prediction.entities,
                });
              case "leaveStatus":
                return await stepContext.beginDialog(leaveStatus,{
                  luisResult: true,
                  entities: luisresponse.luisResult.prediction.entities,
                });
              case "deleteLeave":
                return await stepContext.beginDialog(deleteApplication,{
                  luisResult: true,
                  entities: luisresponse.luisResult.prediction.entities,
                });
              case "recharge":
                return await stepContext.beginDialog(recharge,{
                  luisResult: true,
                  entities: luisresponse.luisResult.prediction.entities,
                })
              default:
                await stepContext.context.sendActivity("Sorry, couldnt get your query");
            }
          }
          console.log('root Dialog');
        }
      case 'qna_yukti':
        {
          console.log('processSampleQnA');
          console.log('inside qna');
          const results = await this.qnaMaker.getAnswers(stepContext.context);

          if (results.length > 0) {
              return await stepContext.context.sendActivity(`${ results[0].answer }`);
          } else {
              return await stepContext.context.sendActivity('Sorry, could not find an answer in the Q and A system.');
          }
        }

        default:
          await stepContext.context.sendActivity("Unrecognised Query.");


    }

    
    
    return await stepContext.endDialog();
  }
}

module.exports.RootDialog = RootDialog;
