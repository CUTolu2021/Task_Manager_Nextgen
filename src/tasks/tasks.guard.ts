import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TaskCreationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    //Removed the check for organisation id from the req.body
    if (request.user.type?.toLowerCase() === 'individual') return true;
    if (request.user.role?.toLowerCase() === 'admin') return true;

    return false;
  }
}