import { IsString, IsNotEmpty, IsEnum, IsNumber } from "class-validator";
import { deleted, taskPriority, taskStatus } from "../entities/task.entity";

export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    taskName: string;

    @IsString()
    @IsNotEmpty()
    taskDescription: string;

   // @IsEnum(taskStatus, {message: "Status must be either LOW, MEDIUM or HIGH"})
    status: taskStatus;

   // @IsEnum(taskPriority, {message: "Priority must be either PENDING, IN_PROGRESS or COMPLETED"})
    priority: taskPriority;

    deleted: deleted;

    @IsNotEmpty()
    dueDate: Date;

    createdAt: Date;

    assignedTo: { id: number; name: string;};
    assignedBy: { id: number; name: string;};

    organisation?: { id: number; };

}
