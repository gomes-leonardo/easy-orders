import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthRequestDTO } from '../application/dto/auth-request-dto';
import { AuthResponseDTO } from '../application/dto/auth-response-dto';
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
  async login(@Body() dto: AuthRequestDTO): Promise<AuthResponseDTO> {
    return await this.authService.login(dto);
  }
}
