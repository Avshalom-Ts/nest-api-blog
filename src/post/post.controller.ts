import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  Res,
  Query,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/user/entities/user.entity';
import { Express, Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/user/user.decorator';
import { ACGuard, UseRoles } from 'nest-access-control';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({ possession: 'any', action: 'create', resource: 'Posts' })
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
    @CurrentUser() user: User,
  ) {
    // eslint-disable-next-line
    // @ts-ignore
    return this.postService.create(createPostDto, req.user as User);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() query: string) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get('/slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  @Post('upload-photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtention = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtention;
          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
    if (!file) {
      throw new BadRequestException('File is not an image');
    } else {
      const response = {
        filePath: 'http://localhost:5000/posts/pictures/${file.filename}',
      };
      return response;
    }
  }

  @Get('pictures/:filename')
  async getPicture(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads' });
  }

  @Patch(':slug')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({ possession: 'any', action: 'update', resource: 'Posts' })
  update(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(slug, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({ possession: 'any', action: 'delete', resource: 'Posts' })
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
