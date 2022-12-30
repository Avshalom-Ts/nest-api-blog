import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // return 'This action adds a new category';
    const category = new Category();
    Object.assign(category, createCategoryDto);
    this.repo.create(category);

    return await this.repo.save(category);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    Object.assign(category, updateCategoryDto);
    return await this.repo.save(category);
  }

  async remove(id: number, @Res() res) {
    // return `This action removes a #${id} category`;
    const category = await this.findOne(id);
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    try {
      await this.repo.remove(category);
      return res.status(200).json({ success: true, category: category });
    } catch (err) {
      throw new BadRequestException('Operation failed');
    }
  }
}
