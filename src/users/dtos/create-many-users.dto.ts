import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManyUsersDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'User',
    },
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => CreateUserDto)
  @ValidateNested({ each: true })
  users: CreateUserDto[];
}
