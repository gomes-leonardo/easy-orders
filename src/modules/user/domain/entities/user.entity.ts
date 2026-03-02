import { DomainError } from '../../../../common/errors/domain.error';
import { UserRole } from '../enums/user-role.enum';

interface UserProps {
  id?: string;
  name?: string;
  cpf?: string;
  email?: string;
  password?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  id?: string;
  name?: string;
  cpf?: string;
  email?: string;
  password?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.cpf = props.cpf;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.email = props.email;
    this.role = props.role;
    this.password = props.password;

    this.validate();
  }

  private validate(): void {
    this.validateEmail();
    this.validateCPF();
    this.validatePassword();
    this.validatePresenceOfIdentifiers();
  }

  private validateEmail(): void {
    if (!this.email) return;

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(this.email)) {
      throw new DomainError('Invalid email format.');
    }
  }

  private validatePassword(): void {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!this.password) return;

    if (!strongPasswordRegex.test(this.password)) {
      throw new DomainError(
        'Password must be 8+ characters and include uppercase, lowercase, number, and special character (!@#$%^&*).',
      );
    }
  }

  private validateCPF(): void {
    if (!this.cpf) return;
    const cleaned = this.cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) {
      throw new DomainError('CPF must contain 11 digits.');
    }
    if (/^(\d)\1{10}$/.test(cleaned)) {
      throw new DomainError('Invalid CPF format.');
    }
    const digits = cleaned.split('').map(Number);
    const firstSum = digits
      .slice(0, 9)
      .reduce((sum, digit, index) => sum + digit * (10 - index), 0);
    const firstVerifier = ((firstSum * 10) % 11) % 10;

    if (digits[9] !== firstVerifier) {
      throw new DomainError('Invalid CPF.');
    }

    const secondSum = digits
      .slice(0, 10)
      .reduce((sum, digit, index) => sum + digit * (11 - index), 0);

    const secondVerifier = ((secondSum * 10) % 11) % 10;

    if (digits[10] !== secondVerifier) {
      throw new DomainError('Invalid CPF.');
    }
  }

  private validatePresenceOfIdentifiers(): void {
    if (this.role === UserRole.ADMIN) {
      if (!this.email || !this.password) {
        throw new DomainError('Admins must have email and password.');
      }
      return;
    }

    const hasEmailAndPass = !!(this.email && this.password);
    const hasCpf = !!this.cpf;
    if (this.role === UserRole.CUSTOMER) {
      if (!hasEmailAndPass && !hasCpf) {
        throw new DomainError(
          'User must be identified by CPF or Email/Password.',
        );
      }
    }
  }
}
