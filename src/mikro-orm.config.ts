import path from 'path';
import { Logger } from '@nestjs/common';
import { Options } from '@mikro-orm/core';
import { UserEntity } from './users/user.entity';
import { MeetupEntity } from './meetups/entities/meetup.entity';
import { AgendaItemEntity } from './meetups/entities/agenda-item.entity';
import { ImageEntity } from './images/image.entity';

const logger = new Logger('MikroORM');

export default {
  entities: [UserEntity, MeetupEntity, AgendaItemEntity, ImageEntity],
  dbName: 'db.sqlite3',
  type: 'sqlite',
  autoFlush: false, // Read more here: https://mikro-orm.io/unit-of-work/
  baseDir: path.join(__dirname, '..'),
  logger: logger.log.bind(logger),
} as Options;
