import { ApiProperty } from '@nestjs/swagger';
import { MeetupEntity } from '../entities/meetup.entity';

export class MeetupDto {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly imageId: number | null;
  readonly date: number | string;
  @ApiProperty({
    title: 'Дата митапа в формате UNIX Timestamp в 00:00:00.000 по UTC',
  })
  readonly organizer: string;
  readonly place: string;
  readonly organizing?: boolean;
  readonly attending?: boolean;

  constructor(meetup: MeetupEntity) {
    this.id = meetup.id;
    this.title = meetup.title;
    this.description = meetup.description;
    this.imageId = meetup?.image?.id ?? null;
    this.date = meetup.date.getTime();
    this.organizer = meetup.organizer.fullname;
    this.place = meetup.place;
    this.organizing = meetup.organizing;
    this.attending = meetup.attending;
  }
}
