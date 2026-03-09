export class AuthResponseDTO {
  user: {
    id: string;
    role: string;
    message: string;
  };
  token: string;
}
