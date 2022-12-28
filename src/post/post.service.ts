import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly repo: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    // return 'This action adds a new post';
    // console.log(createPostDto);
    // return true;
    const slug = createPostDto.title.split(' ').join('_').toLowerCase();

    return await this.repo.insert({ ...createPostDto, slug });
  }

  async findAll(): Promise<Post[]> {
    return await this.repo.find();
  }

  async findOne(id: number) {
    // return `This action returns a #${id} post`;
    const post = await this.repo.findOne({ where: { id } });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    // return `This action updates a #${id} post`;
    return await this.repo.update(id, updatePostDto);
  }

  async remove(id: number) {
    // return `This action removes a #${id} post`;
    return await this.repo.delete(id);
  }
}
