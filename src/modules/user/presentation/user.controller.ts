import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { CreateUserDTO } from '../application/dto/create-user.dto';
import { CreateAdminDTO } from '../application/dto/create-admin.dto';
import { UserResponseDTO } from '../application/dto/user-response-dto';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async listAll(): Promise<UserResponseDTO[]> {
    const users = await this.userService.findAll();

    return (users ?? []).map((u) => UserResponseDTO.fromEntity(u));
  }
  @Post()
  async create(@Body() dto: CreateUserDTO): Promise<UserResponseDTO> {
    const user = await this.userService.create(dto);

    return UserResponseDTO.fromEntity(user);
  }

  @Post('/admin')
  async createAdmin(@Body() dto: CreateAdminDTO): Promise<UserResponseDTO> {
    const user = await this.userService.createAdmin(dto);

    return UserResponseDTO.fromEntity(user);
  }
}
