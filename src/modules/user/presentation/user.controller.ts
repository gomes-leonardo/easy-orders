import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../application/user.service';
import { CreateUserDTO } from '../application/dto/create-user.dto';
import { CreateAdminDTO } from '../application/dto/create-admin.dto';
import { UserResponseDTO } from '../application/dto/user-response-dto';
import { RolesGuard } from '../../auth/infra/guards/roles.guard';
import { Roles } from '../../auth/infra/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../auth/application/auth.service';
import { Response } from 'express';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async listAll(): Promise<UserResponseDTO[]> {
    const users = await this.userService.findAll();

    return (users ?? []).map((u) => UserResponseDTO.fromEntity(u));
  }
  @Post()
  async create(
    @Body() dto: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDTO> {
    const user = await this.userService.create(dto);
    if (!user.id)
      throw new InternalServerErrorException('Failed to create user');

    const token = this.authService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return UserResponseDTO.fromEntity(user);
  }

  @Post('/admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async createAdmin(@Body() dto: CreateAdminDTO): Promise<UserResponseDTO> {
    const user = await this.userService.createAdmin(dto);

    return UserResponseDTO.fromEntity(user);
  }
}
