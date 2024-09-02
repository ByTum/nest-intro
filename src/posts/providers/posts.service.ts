import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  public findAll(userId: string) {
    return [
      {
        title: 'title',
        content: 'content',
      },
      {
        title: 'title 2',
        content: 'content 2',
      },
    ];
  }
}
