import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { ImageEntity } from './image.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [ImageEntity] }),
    MulterModule.register({
      limits: { fileSize: 1024 * 1024 },
    }),
  ],
  providers: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
