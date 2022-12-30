import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly repo: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    // return 'This action adds a new post';
    // console.log(createPostDto);
    // return true;
    // const slug = createPostDto.title.split(' ').join('_').toLowerCase();
    const post = new Post();
    //TODO! post.title = createPostDto.title; insdet in the next line..
    Object.assign(post, createPostDto);
    post.userId = 1; //TODO! For now untile the authintication complet

    this.repo.create(post);
    return await this.repo.save(post);
  }

  //TODO! http://localhost:5000/post?sort=asc&title=firstpost
  async findAll(query: string) {
    // return await this.repo.find();
    const myQuery = this.repo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.user', 'user');

    //Check if the query is present or not
    if (!(Object.keys(query).length === 0) && query.constructor === Object) {
      const queryKeys = Object.keys(query);

      //check if title key is present or not
      if (queryKeys.includes('title')) {
        myQuery.where('post.title LIKE :title', {
          title: `%${query['title']}%`,
        });
      }

      //check if the sort key is present , we will sort the result by title field only
      if (queryKeys.includes('sort')) {
        myQuery.orderBy('post.title', query['sort'].toUpperCase());
      }

      //check if category is present ,show only selected items
      if (queryKeys.includes('category')) {
        myQuery.andWhere('category.title = :cat', { cat: query['category'] });
      }

      return await myQuery.getMany();
    } else {
      return await myQuery.getMany();
    }
  }

  async findOne(id: number) {
    // return `This action returns a #${id} post`;
    const post = await this.repo.findOne({ where: { id } });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    return post;
  }

  async findBySlug(slug: string) {
    // return await this.repo.findOne({ where: { slug } });
    try {
      const post = await this.repo.findOneOrFail({ where: { slug } });
      return post;
    } catch (err) {
      throw new BadRequestException(`Post with slug ${slug} not found`);
    }
  }

  async update(slug: string, updatePostDto: UpdatePostDto) {
    // return `This action updates a #${id} post`;
    // return await this.repo.update(id, updatePostDto);
    const post = await this.repo.findOne({ where: { slug } });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    post.modifiedOn = new Date(Date.now());
    post.category = updatePostDto.category;

    Object.assign(post, updatePostDto);
    return await this.repo.save(post);
  }

  async remove(id: number) {
    // return `This action removes a #${id} post`;
    // return await this.repo.delete(id);
    const post = await this.repo.findOne({ where: { id } });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return await this.repo.remove(post);
    return { success: true, post };
  }
}
