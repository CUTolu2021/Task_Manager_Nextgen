import { Injectable, NotFoundException } from "@nestjs/common";
import { History } from "./History.model";
{}


@Injectable()
export class HistoryService{

    private history: History[] = [];

    addHistory(createdAt: string, action: string, taskId: number){

        // const historyId = new Date().toString();
        var sum = 10 * Math.random();
        Math.round(sum);

        const historyId = sum.toString() ;

        // const createdAt = new Date().toString();
        const newHistory = new History(historyId, createdAt, action, taskId);
        this.history.push(newHistory);

        return historyId;
    }

    getAllHistory(){
        return [...this.history];
    }

    getASingleHistory(historyId: string ){

        const history = this.history.find(prod =>prod.historyId === historyId);
         if (!history){
         throw new NotFoundException('Could not find product with id: ' +historyId);
        }

        return {...history};

    }

}