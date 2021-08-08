import { CreateAgendaItemDto } from './create-agenda-item.dto';
import {
  Allow,
  IsNotEmpty,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  readonly title: string;

  @IsNotEmpty({ message: 'Описание не может быть пустым' })
  readonly description: string;

  @IsNotEmpty({ message: 'Митап должен иметь дату' })
  @ApiProperty({
    description: 'Дата митапа в 00:00:00.000 по UTC',
    example: 1609459200000,
    oneOf: [
      { type: 'number', description: 'Unix Timestamp', example: 1609459200000 },
      { type: 'string', description: 'YYYY-MM-DD', example: '2021-01-01' },
    ],
  })
  @Validate(DateAsStringOrNumberValidator, {
    message:
      'Дата должна быть либо числом, либо строковой датой в формате YYYY-MM-DD ',
  })
  readonly date: string | number;

  @Allow()
  readonly imageId: number;

  @IsNotEmpty({ message: 'Место не может быть пустым' })
  readonly place: string;

  @ValidateNested()
  @Type(() => CreateAgendaItemDto)
  readonly agenda: CreateAgendaItemDto[];
}
