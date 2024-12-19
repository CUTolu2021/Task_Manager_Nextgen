import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { HistoryService } from "./history.service";


@Controller('history')
export class HistoryController {

    constructor (private readonly historyService: HistoryService){}

    @Post()
    createHistory(
        @Body('createdAt')createdAt: string,
        @Body('action')action: string,
        @Body('taskId')taskId: number
    ): any{

        const generatedId = this.historyService.addHistory(createdAt, action, taskId);

        return generatedId;
    }

    @Get()
    getAllHistory(): any{
        return this.historyService.getAllHistory();

    }

    @Get(':id')
    getASingleHistory(@Param('id')historyId: string): any{
        return this.historyService.getASingleHistory(historyId);

    }

    @Patch(':id')
    updateHistory(
        @Param('id')historyId: string, 
        @Body('createdAt')createdAt: string, @Body('action')action: string, @Body('taskId')taskId: number
    ){
        this.historyService.updateProduct(historyId, createdAt, action, taskId);
        return "successfully updated";
    }

    @Delete(':id')
    deleteHistory(@Param('id')historyId: string){

        return this.historyService.deleteHistory(historyId);

    }

}