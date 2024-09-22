import { CreateUserDto } from './../dtos/create-user.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
/**
 * Class to connect to Users table and perform business oeperations
 */
@Injectable()
export class UsersService {
  /**
   * injection with authService
   */
  constructor(
    /**
     * Injective userRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    /**
     * Injective configService
     */
    @Inject(profileConfig.KEY)
    private readonly profileConfigurations: ConfigType<typeof profileConfig>,
    /**
     * Inject datasources
     */
    private readonly dataSources: DataSource,
    /**
     * Inject usersCreateManyProvider
     */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;
    // check email is exist with same email
    try {
      existingUser = await this.usersRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
    } catch (error) {
      // might save the details of the excenption
      // Information which is sensitive
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // Handle exception
    if (existingUser) {
      throw new BadRequestException(
        'The use already exists, please check your email.',
      );
    }
    // Create a new user
    let newUser = this.usersRepository.create(createUserDto);
    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    return newUser;
  }
  /**
   * The mothod to get all users from the database
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist',
        fileName: 'users.service.ts',
        lineNumber: 90,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        // Not send to the client
        cause: new Error(),
        description: 'Occured because the API endpoint was permanently moved',
      },
    );
  }

  /**
   * Find a single user using the ID of the user
   */
  public async findOneById(id: number) {
    let user = undefined;
    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    /**
     * Handle the use does not exist
     */
    if (!user) {
      throw new BadRequestException('The user id does not exist');
    }
    return user;
  }

  public async createMany(createUserDto: CreateUserDto[]) {
    return this.usersCreateManyProvider.createMany(createUserDto);
  }
}
