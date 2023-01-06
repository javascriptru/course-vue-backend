import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsIn, IsMilitaryTime, IsNotEmpty } from 'class-validator';
import { AgendaItemsTypes, agendaItemsTypes } from '../agenda-item-types';

export class CreateAgendaItemDto {
  @ApiProperty({
    title: 'Время начала события',
    example: '08:00',
  })
  @IsNotEmpty()
  @IsMilitaryTime({
    message: 'Время начало должно быть в формате HH:MM',
  })
  readonly startsAt: string;

  @ApiProperty({
    title: 'Время окончания события',
    example: '09:00',
  })
  @IsNotEmpty()
  @IsMilitaryTime({
    message: 'Время окончания должно быть в формате HH:MM',
  })
  readonly endsAt: string;

  @ApiProperty({
    title: 'Тип пункта программы',
    example: 'talk',
    enum: agendaItemsTypes,
  })
  @IsIn(agendaItemsTypes)
  readonly type: AgendaItemsTypes;

  @ApiProperty({
    title: 'Заголовок',
    example: 'Demo Talk',
  })
  @Allow()
  readonly title?: string;

  @ApiProperty({
    title: 'Описание',
    example: 'Talk about demo talking',
  })
  @Allow()
  readonly description?: string;

  @ApiProperty({
    title: 'Докладчик',
    example: 'Dr. Demo, Demo Org',
  })
  @Allow()
  readonly speaker?: string;

  @ApiProperty({
    title: 'Язык доклада',
  })
  @ApiProperty({
    enum: ['RU', 'EN'],
    example: 'EN',
  })
  @Allow()
  readonly language?: 'RU' | 'EN';
}
