import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello and Welcome to the Nextgen Task Management System!';
  }
}
