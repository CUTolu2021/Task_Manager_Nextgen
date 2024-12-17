export class History{

    historyId: string;
    createdAt: string;
    action: string;
    // performer: number;   //This is suppose to be the user ID???
    taskId: number;

    constructor(historyId: string, createdAt: string, action: string, taskId: number){

        this.historyId = historyId;
        this.createdAt = createdAt;
        this.action = action;
        this.taskId = taskId;

    }

}