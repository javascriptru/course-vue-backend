import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({
    type: 'file',
    format: 'binary',
    description: 'Файл изображения, максимум 1МБ',
  })
  file: Buffer;
}
