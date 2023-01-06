import {
  Allow,
  IsNotEmpty,
  Validate,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAgendaItemDto } from './create-agenda-item.dto';

@ValidatorConstraint()
class DateAsStringOrNumberValidator implements ValidatorConstraintInterface {
  validate(text: string | number) {
    if (typeof text === 'string') {
      return /^\d\d\d\d-\d\d-\d\d/.test(text) && !isNaN(Date.parse(text));
    } else if (typeof text === 'number') {
      return true;
    }
    return false;
  }
}

export class CreateMeetupDto {
  @ApiProperty({ example: 'Demo Meetup' })
  @IsNotEmpty({ message: 'Митап должен иметь название' })
  readonly title: string;

  @ApiProperty({ example: 'Lorem ipsum....' })
  @IsNotEmpty({ message: 'Митап должен иметь описание' })
  readonly description: string;

  @IsNotEmpty({ message: 'Митап должен иметь дату' })
  @ApiProperty({
    description: 'Дата митапа в 00:00:00.000 по UTC',
    example: 1672531200000,
    oneOf: [
      { type: 'number', description: 'Unix Timestamp', example: 1672531200000 },
      {
        type: 'string',
        description: 'YYYY-MM-DD',
        example: '2023-01-01',
        deprecated: true,
      },
    ],
  })
  @Validate(DateAsStringOrNumberValidator, {
    message:
      'Дата должна быть либо числом, либо строковой датой в формате YYYY-MM-DD ',
  })
  readonly date: string | number;

  @ApiProperty({ example: 'Demo Place' })
  @IsNotEmpty({ message: 'Митап должен иметь место проведения' })
  readonly place: string;

  @Allow()
  @ApiProperty({
    description: 'ID ранее загруженного изображения',
    example: 1,
  })
  readonly imageId: number;

  @ValidateNested()
  @Type(() => CreateAgendaItemDto)
  readonly agenda: CreateAgendaItemDto[];
}
