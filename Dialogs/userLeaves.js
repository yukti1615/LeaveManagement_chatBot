class UserLeaves {
    constructor(leavetype, leavedays, leavedate, leavereason, tokenNum) {
        this.leavetype = leavetype;
        this.leavedays = leavedays;
        this.leavedate = leavedate;
        this.leavereason = leavereason;
        this.tokenNum = tokenNum;
    }
}

module.exports.UserLeaves =  UserLeaves;

