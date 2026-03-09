import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../application/auth.service';
import { AuthRequestDTO } from '../application/dto/auth-request-dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: AuthRequestDTO,
    examples: {
      cpf: {
        summary: 'Login with CPF',
        value: { cpf: '305.000.480-02' },
      },
      emailPassword: {
        summary: 'Login with email and password',
        value: { email: 'teste@teste.com', password: 'Mudar@123' },
      },
    },
  })
  @Post('/login')
  async login(
    @Body() dto: AuthRequestDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ id: string; role: string; message: string }> {
    const { user, token } = await this.authService.login(dto);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return user;
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return this.authService.logout();
  }
}
