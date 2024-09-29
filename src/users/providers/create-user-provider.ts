import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Injective userRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    /**
     * Injective hashingProvider
     */
    @Inject(forwardRef(() => HashingProvider))
    private hashingProvider: HashingProvider,
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
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPasword(createUserDto.password),
    });
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
}
