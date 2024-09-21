import { CreateUserDto } from './../dtos/create-user.dto';
import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
    // injective authService
    // @Inject(forwardRef(() => AuthService))
    // private readonly authService: AuthService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // check email is exist with same email
    const existingUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    // Handle exception
    // Create a new user
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

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
    // const isAuth = this.authService.isAuth();
    // console.log(isAuth);
    const environment = this.configService.get<string>('S3_BUCKET');
    console.log(environment);
    return [
      {
        firstName: 'John',
        email: 'john@gmail.com',
      },
      {
        firstName: 'kk',
        email: 'kk@gmail.com',
      },
    ];
  }

  /**
   * Find a single user using the ID of the user
   */
  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }
}
