import { Injectable } from "@nestjs/common";
import { History } from "./History.model";
{}


@Injectable()
export class HistoryService{

    private history: History[] = [];

    addHistory(createdAt: string, action: string, taskId: number){

        const historyId = new Date().toString();
        // const createdAt = new Date().toString();
        const newHistory = new History(historyId, createdAt, action, taskId);
        this.history.push(newHistory);

        return historyId;
    }

}