import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDTO {
  @ApiProperty({ description: 'Nome opcional', example: 'Leonardo Gomes' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'E-mail para cadastro',
    example: 'teste@teste.com',
  })
  @IsNotEmpty({ message: 'Email is required.' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Senha para cadastro', example: 'Mudar@123' })
  @IsNotEmpty({ message: 'Password is required for admin registration' })
  @IsString()
  password: string;
}
