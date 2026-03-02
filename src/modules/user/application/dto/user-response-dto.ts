import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';

export class UserResponseDTO {
  id: string;
  email?: string;
  cpf?: string;
  role: UserRole;

  static fromEntity(user: User): UserResponseDTO {
    const dto = new UserResponseDTO();
    dto.id = user.id!;
    dto.email = user.email;
    dto.cpf = user.cpf;
    dto.role = user.role;
    return dto;
  }
  static fromEntityList(user: User[]): UserResponseDTO[] {
    return user.map((u) => UserResponseDTO.fromEntity(u));
  }
}
