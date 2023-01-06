import { BadRequestException } from '@nestjs/common';

export function fileFilter(req, file, callback): void {
  if (!file.mimetype.includes('image/')) {
    callback(
      new BadRequestException('Поддерживаются только изображения'),
      false,
    );
  } else {
    callback(null, true);
  }
}
