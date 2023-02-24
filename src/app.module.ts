import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Post } from './post/entities/post.entity';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './user/user.module';
import { Category } from './category/entities/category.entity';
import { User } from './user/entities/user.entity';
import { AccessControlModule } from 'nest-access-control';
import { roles } from './user/user-roles';

@Module({
  imports: [
    PostModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      // database: 'yourdb',
      database: 'blog-tutorial',
      entities: [Post, Category, User],
      synchronize: true,
    }),
    CategoryModule,
    AuthModule,
    AccessControlModule.forRoles(roles),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
