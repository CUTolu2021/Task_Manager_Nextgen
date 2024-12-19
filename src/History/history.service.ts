import { Injectable, NotFoundException } from "@nestjs/common";
import { History } from "./History.model";
{}


@Injectable()
export class HistoryService{

    private history: History[] = [];

    addHistory(createdAt: string, action: string, taskId: number){

        // const historyId = new Date().toString();
        var sum = 10 * Math.random();
        sum = Math.round(sum);

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

    updateProduct(historyId: string, createdAt: string, action: string, taskId: number){
        const [history, index] = this.findHistory(historyId);
        const updatedProduct = {...history};
        if(createdAt){
            updatedProduct.createdAt = createdAt;
        }
        if(action){
            updatedProduct.action = action;
        }
        if(taskId){
            updatedProduct.taskId = taskId;
        }
    
        this.history[index] = updatedProduct;

    }

    deleteHistory(hId: string){

        const index = this.findHistory(hId)[1];
        this.history.splice(index, 1);

        return "Deleted historyId: "+hId+ " successfully";
    }

    private findHistory(id: string): [History, number]{
        const historyIndex = this.history.findIndex(prod =>prod.historyId === id);
        const history = this.history[historyIndex];

        if (!history){
            throw new NotFoundException('Could not find history with id: ' +id);
        }
        return [history, historyIndex];
    }

}