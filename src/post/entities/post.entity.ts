import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import slugify from 'slugify';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column()
  slug: string;
  @Column({ type: 'timestamp', default: (): string => 'CURRENT_TIMESTAMP' })
  createdOn: Date;
  @Column({ type: 'timestamp', default: (): string => 'CURRENT_TIMESTAMP' })
  modifiedOn: Date;
  @Column()
  mainImageUrl: string;

  @Column()
  userId: number;

  @Column({ default: 3 })
  categoryId: number;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.post, { eager: true })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @BeforeInsert()
  slugifyPost() {
    this.slug = slugify(this.title.substr(0, 20), {
      lower: true,
      replacement: '_',
    }); //this is a title of a post
  }
}
