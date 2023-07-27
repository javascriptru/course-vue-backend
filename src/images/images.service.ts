import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { ImageEntity } from './image.entity';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imagesRepository: EntityRepository<ImageEntity>,
    private readonly em: EntityManager,
  ) {}

  async saveImage(
    file: Express.Multer.File,
    user: UserEntity,
  ): Promise<ImageEntity> {
    this.em.merge(user);
    const image = new ImageEntity();
    image.data = file.buffer;
    image.mimetype = file.mimetype;
    image.size = file.size;
    image.user = user;
    await this.imagesRepository.persistAndFlush(image);
    return image;
  }

  async getImage(id: number | string): Promise<ImageEntity> {
    return await this.imagesRepository.findOne(
      typeof id === 'string' ? parseInt(id) : id,
    );
  }
}
