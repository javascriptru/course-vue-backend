import { ApiProperty } from '@nestjs/swagger';
import { MeetupAgendaItemDto } from './meetup-agenda-item.dto';
import { MeetupEntity } from '../entities/meetup.entity';

export class MeetupDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty({ deprecated: true })
  readonly imageId: number | null;

  @ApiProperty({ description: 'Ссылка на изображение' })
  readonly image: string | null;

  @ApiProperty({
    description: 'Дата митапа в формате UNIX Timestamp в 00:00:00.000 по UTC',
    example: 1672531200000,
  })
  readonly date: number;

  @ApiProperty({
    description: 'Дата митапа в формате YYYY-MM-DD по UTC',
    example: '2023-01-01',
  })
  readonly dateIso: string;

  @ApiProperty()
  readonly organizer: string;

  @ApiProperty()
  readonly place: string;

  @ApiProperty({
    description:
      'Является ли текущий пользователь организатором митапа (только для авторизованных пользователей)',
  })
  readonly organizing?: boolean;

  @ApiProperty({
    description:
      'Является ли текущий пользователь участником митапа (только для авторизованных пользователей)',
  })
  readonly attending?: boolean;

  @ApiProperty({ type: [MeetupAgendaItemDto] })
  readonly agenda: MeetupAgendaItemDto[];

  constructor(meetup: MeetupEntity, publicUrl: string) {
    this.id = meetup.id;
    this.title = meetup.title;
    this.description = meetup.description;
    this.imageId = meetup?.image?.id ?? null;
    this.image = meetup?.image?.getPublicImageUrl?.(publicUrl) ?? null;
    this.date = meetup.date.getTime();
    this.dateIso = meetup.date.toISOString().substring(0, 10);
    this.organizer = meetup.organizer.fullname;
    this.place = meetup.place;
    this.organizing = meetup.organizing;
    this.attending = meetup.attending;

    this.agenda = meetup.agenda
      .getItems()
      .map((item) => new MeetupAgendaItemDto(item));
  }
}
