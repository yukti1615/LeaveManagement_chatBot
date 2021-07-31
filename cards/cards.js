
let leavebal = {sickLeave : 100, casualLeave: 100, earnedLeave: 100}
module.exports = {
    confirmleave: (leavetype, leavedate, leavedays, leavereason) => {
        return{
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.3",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "Image",
                                    "url": "https://www.celebaltech.com/assets/img/celebal.webp",
                                    "spacing": "Small",
                                    "size": "Medium"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "wrap": true,
                                    "text": "Leave Application",
                                    "size": "Medium",
                                    "weight": "Bolder",
                                    "horizontalAlignment": "Center"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "wrap": true,
                                    "text": "Leave  Type",
                                    "weight": "Bolder",
                                    "color": "Dark",
                                    "size": "Medium"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "wrap": true,
                                    "text": `${leavetype}`
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Starting Date",
                                    "wrap": true,
                                    "weight": "Bolder",
                                    "size": "Medium"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "wrap": true,
                                    "text": `${leavedate}`
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Number of Days",
                                    "wrap": true,
                                    "size": "Medium",
                                    "weight": "Bolder"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text":  `${leavedays}`,
                                    "wrap": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Reason",
                                    "wrap": true,
                                    "size": "Medium",
                                    "weight": "Bolder"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "wrap": true,
                                    "text":  `${leavereason}`
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },

    leavestatus: (leaveTypeArray,leaveDaysArray, leaveDateArray, leaveReasonArray, leaveTokenNumArray, leaveStatusArray) =>{
        return{
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.3",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "Image",
                            "url": "https://www.celebaltech.com/assets/img/celebal.webp",
                            "size": "Medium"
                        },
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "wrap": true,
                                            "text": "Leave Token Number",
                                            "weight": "Bolder",
                                            "horizontalAlignment": "Left"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "wrap": true,
                                            "text": "Leave Type",
                                            "weight": "Bolder",
                                            "horizontalAlignment": "Left"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Days",
                                            "wrap": true,
                                            "horizontalAlignment": "Left",
                                            "weight": "Bolder"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "wrap": true,
                                            "weight": "Bolder",
                                            "text": "Start Date",
                                            "horizontalAlignment": "Left",
                                            
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Leave Status",
                                            "wrap": true,
                                            "weight": "Bolder",
                                            "horizontalAlignment": "Left",
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },

                //collapse and for loop
                // totalLeaves.forEach()
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "automatic",
                            "items": leaveTokenNumArray
                        },
                        {
                            "type": "Column",
                            "width": "automatic",
                            "items": leaveTypeArray
                        },
                        {
                            "type": "Column",
                            "width": "automatic",
                            "items": leaveDaysArray
                        },
                        {
                            "type": "Column",
                            "width": "automatic",
                            "items": leaveDateArray
                        },
                        {
                            "type": "Column",
                            "width": "automatic",
                            "items": leaveStatusArray
                        }
                    ]
                }
            ]
        }
    }, 

    welcomeCard: () =>{
        return {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.3",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "Image",
                            "url": "https://i.pinimg.com/originals/79/04/42/7904424933cc535b666f2de669973530.gif",
                            "width": "233px",
                            "height": "179px"
                        }
                    ]
                },
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Hi, I am your Assistant for today.I can help you with Leave related queries.\n\n",
                            "wrap": true,
                            "fontType": "Default",
                            "size": "Medium",
                            "weight": "Bolder",
                            "color": "Accent"
                        }
                    ]
                }
            ]
        }
    },
    leavebalance: (leavebal) =>{
        return {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.3",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "Container",
                            "items": [
                                {
                                    "type": "ColumnSet",
                                    "columns": [
                                        {
                                            "type": "Column",
                                            "width": "stretch",
                                            "items": [
                                                {
                                                    "type": "Image",
                                                    "url": "https://www.celebaltech.com/assets/img/celebal.webp",
                                                    "size": "Medium"
                                                }
                                            ]
                                        },
                                        {
                                            "type": "Column",
                                            "width": "stretch",
                                            "items": [
                                                {
                                                    "type": "TextBlock",
                                                    "text": "Available Leave Balance",
                                                    "wrap": true,
                                                    "size": "Medium",
                                                    "horizontalAlignment": "Center",
                                                    "weight": "Bolder"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "ColumnSet",
                                            "columns": [
                                                {
                                                    "type": "Column",
                                                    "width": "stretch",
                                                    "items": [
                                                        {
                                                            "type": "TextBlock",
                                                            "text": "Leave Type",
                                                            "wrap": true,
                                                            "horizontalAlignment": "Center",
                                                            "fontType": "Default",
                                                            "size": "Medium",
                                                            "color": "Accent"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type": "Column",
                                                    "width": "stretch",
                                                    "items": [
                                                        {
                                                            "type": "TextBlock",
                                                            "text": "Balance",
                                                            "wrap": true,
                                                            "size": "Medium",
                                                            "horizontalAlignment": "Center",
                                                            "color": "Accent"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Sick Leave",
                                    "wrap": true,
                                    "horizontalAlignment": "Center",
                                    "size": "Medium",
                                    "weight": "Bolder"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `${leavebal.sickLeave}`,
                                    "wrap": true,
                                    "horizontalAlignment": "Center"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "wrap": true,
                                    "size": "Medium",
                                    "weight": "Bolder",
                                    "horizontalAlignment": "Center",
                                    "text": "Casual Leave"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `${leavebal.casualLeave}`,
                                    "wrap": true,
                                    "horizontalAlignment": "Center"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "wrap": true,
                                    "text": "Earned Leave",
                                    "horizontalAlignment": "Center",
                                    "size": "Medium",
                                    "weight": "Bolder"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `${leavebal.earnedLeave}`,
                                    "wrap": true,
                                    "horizontalAlignment": "Center"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }, leavebal, 
}
