import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUserGuard } from '../user/current-user.guard';
import { User } from './entities/user.entity';
import { CurrentUser } from './user.decorator';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async userLogin(@Body() userLoginDto: UserLoginDto, @Res() res: Response) {
    console.log(userLoginDto);
    const { token, user } = await this.userService.login(userLoginDto);

    res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 }); //Max age 2 hours
    res.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.send({ success: true, user });
  }

  @Post('register')
  async userRegistration(@Body() userCreateDto: CreateUserDto) {
    return await this.userService.register(userCreateDto);
  }

  @Get()
  @UseGuards(CurrentUserGuard)
  authStatus(@CurrentUser() user: User) {
    return { status: !!user, user };
  }
}
