import { Module } from '@nestjs/common';
import { MeetupsController } from './meetups.controller';
import { MeetupsService } from './meetups.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MeetupEntity } from './entities/meetup.entity';
import { ImageEntity } from '../images/image.entity';
import { AgendaItemEntity } from './entities/agenda-item.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [MeetupEntity, AgendaItemEntity, ImageEntity],
    }),
  ],
  controllers: [MeetupsController],
  providers: [MeetupsService],
})
export class MeetupsModule {}
