import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
   
  @Injectable()
  export class CommentCreationGuard implements CanActivate {
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      
    
        if (request.user.type?.toLowerCase() === 'organisation') return true
        
        
        
      return false;
    }
  
    
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  