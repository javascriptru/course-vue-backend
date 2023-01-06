import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty({ description: 'HTTP Status Code', example: 400 })
  readonly statusCode!: number;

  @ApiProperty({
    description: 'Текст ошибки для пользователя',
    example: 'Ошибка',
  })
  readonly message!: string;

  @ApiProperty({
    description: 'HTTP Status Text',
    example: 'Bad Request',
  })
  readonly error!: string;
}
