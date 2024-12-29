import { HistoryAction } from "../entities/history.entity";

export class CreateHistoryDto {
    action: HistoryAction;
    task: { id: number };
    user: { id: number };
    createdAt: Date
}
