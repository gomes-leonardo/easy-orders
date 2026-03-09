import { UserRole } from '../enums/user-role.enum';
import { User } from './user.entity';

describe('User Entity', () => {
  it('Should create a user with valid CPF', () => {
    const validCpf = '12345678909';
    const user = new User({
      cpf: validCpf,
      role: UserRole.CUSTOMER,
    });

    expect(user.cpf).toBe(validCpf);
    expect(user.email).toBeUndefined();
    expect(user.password).toBeUndefined();
  });

  it('Should throw an error if CPF format is invalid', () => {
    const invalidCpf = '11111111111';

    expect(() => {
      new User({ cpf: invalidCpf, role: UserRole.CUSTOMER });
    }).toThrow('Invalid CPF format.');
  });

  it('Should create a user with valid email and password', () => {
    const validEmail = 'leonardo@test.com';
    const user = new User({
      email: validEmail,
      password: 'Mudar@123',
      role: UserRole.CUSTOMER,
    });

    expect(user.email).toBe(validEmail);
    expect(user.cpf).toBeUndefined();
  });

  it('Should throw an error if admin is created with only cpf (no email or password)', () => {
    expect(() => {
      new User({
        cpf: '794.265.750-73',
        role: UserRole.ADMIN,
      });
    }).toThrow('Admins must have email and password.');
  });

  it('Should throw an error if email format is invalid', () => {
    const invalidEmail = 'invalid-email';

    expect(() => {
      new User({
        email: invalidEmail,
        password: 'Mudar@123',
        role: UserRole.CUSTOMER,
      });
    }).toThrow('Invalid email format.');
  });

  it('Should throw an error if ADMIN is created without email or password', () => {
    expect(() => {
      new User({
        role: UserRole.ADMIN,
      });
    }).toThrow('Admins must have email and password.');
  });

  it('Should create a GUEST user without any identification', () => {
    const guest = new User({
      role: UserRole.GUEST,
    });

    expect(guest.role).toBe(UserRole.GUEST);
    expect(guest.cpf).toBeUndefined();
    expect(guest.email).toBeUndefined();
    expect(guest.password).toBeUndefined();
  });

  it('Should throw an error if CUSTOMER has neither CPF nor Email/Password', () => {
    expect(() => {
      new User({
        role: UserRole.CUSTOMER,
      });
    }).toThrow('User must be identified by CPF or Email/Password.');
  });

  it('should throw an error when password does not meet strength requirements', () => {
    expect(() => {
      new User({
        email: 'admin@test.com',
        password: 'abc123',
        role: UserRole.ADMIN,
      });
    }).toThrow(
      'Password must be 8+ characters and include uppercase, lowercase, number, and special character (!@#$%^&*).',
    );
  });
});
