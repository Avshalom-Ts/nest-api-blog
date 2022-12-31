import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { Response } from 'express';

@Controller('auth')
export class UserController {
  constructor(private readonly authService: UserService) {}

  @Post('login')
  async userLogin(@Body() userLoginDto: UserLoginDto, @Res() res: Response) {
    console.log(userLoginDto);
    const { token, user } = await this.authService.login(userLoginDto);

    res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 }); //Max age 2 hours
    res.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.send({ success: true, user });
  }
}
