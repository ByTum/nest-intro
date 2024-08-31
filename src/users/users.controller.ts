import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  Headers,
  Ip,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id/:optional?')
  public getUsers(@Param('id') id: any, @Query('limit') limit: any) {
    console.log(id);
    console.log(limit);
    return 'You send a get request to users endpoint';
  }

  @Post()
  public createUsers(
    @Body() request: any,
    @Headers() headers: any,
    @Ip() ip: any,
  ) {
    console.log(request);
    console.log(headers);
    console.log(ip);
    return 'You send a post request to users endpoint';
  }
}
