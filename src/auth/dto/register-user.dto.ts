import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    title: 'Полное имя',
    example: 'Demo Organizer',
  })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  readonly fullname!: string;

  @ApiProperty({
    title: 'Email',
    example: 'demo@email',
  })
  @IsEmail({}, { message: 'Email адрес должен быть валидным' })
  readonly email!: string;

  @ApiProperty({
    title: 'Пароль',
    example: 'password',
  })
  @MinLength(6, { message: 'Пароль должен состоять как минимум из 6 символов' })
  readonly password!: string;
}
