import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  public getUsers() {
    return 'You send a get request to users endpoint';
  }

  @Post()
  public postUsers() {
    return 'You send a post request to users endpoint';
  }
}
