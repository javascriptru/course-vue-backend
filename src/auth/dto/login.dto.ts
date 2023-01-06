import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    title: 'Email',
    example: 'demo@email',
  })
  @Allow()
  readonly email!: string;

  @ApiProperty({
    title: 'Пароль',
    example: 'password',
  })
  @Allow()
  readonly password!: string;
}
