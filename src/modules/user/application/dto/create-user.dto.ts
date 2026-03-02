import { IsString, IsNotEmpty, ValidateIf, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'CPF is required when email is not provided' })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({
    description: 'E-mail para cadastro',
    example: 'teste@teste.com',
  })
  @ValidateIf((o: CreateUserDTO) => Boolean(!o.cpf))
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Senha para cadastro', example: 'Mudar@123' })
  @IsOptional()
  @ValidateIf((o: CreateUserDTO) => Boolean(o.email))
  @IsString()
  password?: string;
}
