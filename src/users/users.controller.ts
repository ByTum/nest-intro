import { Controller, Get, Param, Post, Query, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id/:optional?')
  public getUsers(@Param() params: any, @Query() query: any) {
    console.log(params);
    console.log(query);
    return 'You send a get request to users endpoint';
  }

  @Post()
  public createUsers(@Body() request: any) {
    console.log(request);
    return 'You send a post request to users endpoint';
  }
}
