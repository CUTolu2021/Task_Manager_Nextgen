import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <h1>Welcome to the Nextgen Task Management System!</h1>
      <p>
        The Nextgen Task Management System is designed to help you manage your tasks efficiently and effectively. 
        Whether you are an individual or part of an organization, our system provides the tools you need to stay organized and productive.
      </p>
      <h2>Features</h2>
      <ul>
        <li>Create and manage tasks</li>
        <li>Assign tasks to team members</li>
        <li>Track task progress and status</li>
        <li>Comment on tasks and collaborate with your team</li>
        <li>Manage user roles and permissions</li>
        <li>View task history and activity logs</li>
      </ul>
      <h2>Getting Started</h2>
      <p>
        To get started, please refer to our <a href="https://documenter.getpostman.com/view/26562270/2sAYJ7hf2f" target="_blank">Postman Documentation</a> for API details and usage instructions.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions or need support, please contact our support team at support@nextgentaskmanager.com.
      </p>
    `;
  }
}
