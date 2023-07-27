import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { MeetupEntity } from './meetup.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AgendaItemsTypes, agendaItemsTypes } from '../agenda-item-types';

@Entity({ tableName: 'agenda_items' })
export class AgendaItemEntity {
  @PrimaryKey()
  id: number;

  @ManyToOne({
    entity: () => MeetupEntity,
    onDelete: 'cascade',
  })
  meetup!: MeetupEntity;

  @Property()
  startsAt: string;

  @Property()
  endsAt: string;

  @ApiProperty({
    enum: agendaItemsTypes,
  })
  @Property()
  type!: AgendaItemsTypes;

  @Property()
  title?: string;

  @Property()
  description?: string;

  @Property()
  speaker?: string;

  @ApiProperty({
    enum: ['RU', 'EN'],
  })
  @Property()
  language?: 'RU' | 'EN';

  constructor(agendaEvent: Partial<AgendaItemEntity>) {
    this.startsAt = agendaEvent.startsAt;
    this.endsAt = agendaEvent.endsAt;
    this.type = agendaEvent.type;
    this.title = agendaEvent.title;
    this.description = agendaEvent.description;
    this.speaker = agendaEvent.speaker;
    this.language = agendaEvent.language;
  }
}
