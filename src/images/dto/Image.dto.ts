import { ImageEntity } from '../image.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  @ApiProperty({
    title: 'ID',
    example: 1,
  })
  readonly id: number;

  @ApiProperty({
    title: 'Ссылка на изображения',
    example: 'https://course-vue.javascript.ru/api/images/1.jpeg',
  })
  readonly image: string;

  constructor(image: ImageEntity, publicUrl: string) {
    this.id = image.id;
    this.image = image.getPublicImageUrl(publicUrl);
  }
}
