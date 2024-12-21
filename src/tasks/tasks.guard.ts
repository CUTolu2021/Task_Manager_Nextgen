import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
 
@Injectable()
export class TaskCreationGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log("in taskguard", request.user)
    console.log("in taskguard", request.organisation)
    
  //Removed the check for organisation id from the req.body
      if (request.user.type?.toLowerCase() === 'individual') return true
      if (request.user.role?.toLowerCase() === 'admin') return true
      
      
    return false;
  }

  
}














