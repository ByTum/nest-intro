import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    /**
     * Injecting UserService
     * */
    private readonly usersService: UsersService,
    /**
     * Inject postsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    /**
     * Inject metaOptionsRepository
     */
    @InjectRepository(MetaOption)
    public readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  /**
   * creting new posts
   */
  public async create(createPostDto: CreatePostDto) {
    // Create post
    const post = this.postsRepository.create(createPostDto);
    // return the post
    return await this.postsRepository.save(post);
  }

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    return [
      {
        user: user,
        title: 'title',
        content: 'content',
      },
      {
        user: user,
        title: 'title 2',
        content: 'content 2',
      },
    ];
  }
}
