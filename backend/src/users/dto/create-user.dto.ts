import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(6)
  contraseña: string;
}
