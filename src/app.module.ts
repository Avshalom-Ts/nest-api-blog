import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Post } from './post/entities/post.entity';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { Category } from './category/entities/category.entity';

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
      entities: [Post, Category],
      synchronize: true,
    }),
    CategoryModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
