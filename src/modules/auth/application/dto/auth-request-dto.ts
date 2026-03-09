import { IsString, ValidateIf, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRequestDTO {
  @ApiProperty({
    description: 'CPF for authentication (alternative to email/password)',
    example: '305.000.480-02',
    required: false,
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({
    description: 'Email for authentication (required if CPF is not provided)',
    example: 'teste@teste.com',
    required: false,
  })
  @ValidateIf((o: AuthRequestDTO) => Boolean(!o.cpf))
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Password (required when authenticating with email)',
    example: 'Mudar@123',
    required: false,
  })
  @IsOptional()
  @ValidateIf((o: AuthRequestDTO) => Boolean(o.email))
  @IsString()
  password?: string;
}
