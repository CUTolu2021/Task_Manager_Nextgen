import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello and Welcome to the Nextgen Task Management System! Make sure you check our Postman Documentation : https://documenter.getpostman.com/view/26562270/2sAYJ7hf2f';
  }
}
