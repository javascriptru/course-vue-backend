import { UserEntity } from '../../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    title: 'ID пользователя',
    example: 1,
  })
  readonly id!: number;

  @ApiProperty({
    title: 'Полное имя',
    example: 'Demo Organizer',
  })
  readonly fullname!: string;

  @ApiProperty({
    title: 'Email',
    example: 'demo@email',
  })
  readonly email!: string;

  @ApiProperty({
    title: 'Ссылка на аватар в сервисе gravatar',
    example:
      'https://www.gravatar.com/avatar/e2a3ce530515ad5da2f3a75e8b601506?s=28&d=identicon',
  })
  readonly avatar!: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.fullname = user.fullname;
    this.email = user.email;
    this.avatar = user.avatar;
  }
}
