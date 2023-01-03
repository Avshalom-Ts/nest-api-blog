import { Post } from 'src/post/entities/post.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRoles } from '../user-roles';
// import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column({ select: false })
  //TODO! We can use the select : false or @Exclude() to keep the data from the fronEnd.
  // @Exclude()
  password: string;

  @Column({ default: null })
  profilepic: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.Reader })
  roles: UserRoles;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
