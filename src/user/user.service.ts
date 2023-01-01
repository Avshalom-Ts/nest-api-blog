import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: UserLoginDto) {
    // console.log(loginDto);
    const user = await this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginDto.email })
      .getOne();
    // console.log(user);
    if (!user) {
      throw new UnauthorizedException('Bad credentials - user not found');
    } else {
      // verify that the supplied password is mathing with the hash password in dabaBase
      if (await this.verifyPassword(loginDto.password, user.password)) {
        const token = this.jwtService.signAsync({
          email: user.email,
          id: user.id,
        });

        delete user.password;
        return { token, user };
      } else {
        throw new UnauthorizedException('Bad credentials - password not match');
      }
    }
  }

  async verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async register(createUserDto: CreateUserDto) {
    // console.log(createUserDto);
    const { email } = createUserDto;
    // console.log({ email });
    const checkForUser = await this.repo.findOne({ where: { email } });
    // console.log(checkForUser);
    if (checkForUser) {
      throw new BadRequestException(
        console.log('Throw error'),
        'Email is alredy chosen, please choose a new one',
      );
    } else {
      const user = new User();
      console.log(createUserDto);
      Object.assign(user, createUserDto);
      this.repo.create(user);
      await this.repo.save(user);
      delete user.password;
      return user;
    }
  }
}
