import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSources: DataSource) {}
  public async createMany(createUserDto: CreateUserDto[]) {
    const newUsers: User[] = [];
    // Create QueryRunner instance
    const queryRunner = this.dataSources.createQueryRunner();

    // Connect Query Runner to datasource
    await queryRunner.connect();

    // Start Transaction
    await queryRunner.startTransaction();
    try {
      for (const user of createUserDto) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // If Successfull commit
      await queryRunner.commitTransaction();
    } catch (error) {
      // If unsessfull rollback
      await queryRunner.rollbackTransaction();
    } finally {
      // Release connection
      await queryRunner.release();
    }

    return newUsers;
  }
}
