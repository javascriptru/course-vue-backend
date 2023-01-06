import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UnprocessableEntityException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MeetupsService } from './meetups.service';
import {
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiNotFoundResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { MeetupDto } from './dto/meetup.dto';
import { UserEntity } from '../users/user.entity';
import { ReqUser } from '../common/decorators/user.decorator';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { ConfigService } from '@nestjs/config';
import { ErrorDto } from '../common/dto/error.dto';

@ApiTags('Meetups')
@Controller('meetups')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      throw new UnprocessableEntityException(
        Object.values(errors[0].constraints)[0],
      );
    },
    errorHttpStatusCode: 422,
    validationError: {
      target: true,
      value: true,
    },
  }),
)
export class MeetupsController {
  constructor(
    @Inject(MeetupsService) private readonly meetupService: MeetupsService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Получение списка всех митапов' })
  async findAll(@ReqUser() user: UserEntity): Promise<MeetupDto[]> {
    const meetups = await this.meetupService.findAll(user);
    return meetups.map(
      (meetup) => new MeetupDto(meetup, this.configService.get('publicUrl')),
    );
  }

  @Get(':meetupId')
  @ApiOperation({
    summary: 'Получение митапа по ID',
  })
  @ApiNotFoundResponse({ description: 'Отсутствует митап с таким ID' })
  async findById(
    @Param('meetupId', ParseIntPipe) meetupId: number,
    @ReqUser() user: UserEntity,
  ) {
    const meetup = await this.meetupService.findById(meetupId, user);
    return new MeetupDto(meetup, this.configService.get('publicUrl'));
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  @ApiSecurity('cookie-session')
  @ApiOperation({ summary: 'Создание нового митапа' })
  @ApiCreatedResponse({
    description: 'Митап успешно создан',
    type: MeetupDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Ошибка валидации',
    type: ErrorDto,
  })
  async createMeetup(
    @Body() meetupDto: CreateMeetupDto,
    @ReqUser() user: UserEntity,
  ): Promise<MeetupDto> {
    const meetup = await this.meetupService.createMeetup(meetupDto, user);
    return new MeetupDto(meetup, this.configService.get('publicUrl'));
  }

  @Put(':meetupId')
  @UseGuards(AuthenticatedGuard)
  @ApiSecurity('cookie-session')
  @ApiOperation({ summary: 'Обновление митапа' })
  @ApiNotFoundResponse({
    description: 'Отсутствует митап с таким ID у текущего пользователя',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Ошибка валидации',
    type: ErrorDto,
  })
  async updateMeetup(
    @ReqUser() user: UserEntity,
    @Param('meetupId', ParseIntPipe) meetupId: number,
    @Body() meetupDto: CreateMeetupDto,
  ): Promise<MeetupDto> {
    const meetup = await this.meetupService.updateMeetup(
      meetupId,
      meetupDto,
      user,
    );
    return new MeetupDto(meetup, this.configService.get('publicUrl'));
  }

  @Delete(':meetupId')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: 'Удаление митапа' })
  @ApiSecurity('cookie-session')
  async deleteMeetup(@Param('meetupId', ParseIntPipe) meetupId: number) {
    return this.meetupService.deleteMeetup(meetupId);
  }

  @Post(':meetupId/participation')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Добавление текущего пользователя в список участников митапа',
  })
  @ApiNotFoundResponse({
    description: 'Отсутствует митап с таким ID у текущего пользователя',
  })
  @ApiSecurity('cookie-session')
  async attendMeetup(
    @Param('meetupId', ParseIntPipe) meetupId: number,
    @ReqUser() user: UserEntity,
  ) {
    return this.meetupService.attendMeetup(meetupId, user);
  }

  @Put(':meetupId/participation')
  @UseGuards(AuthenticatedGuard)
  @ApiExcludeEndpoint()
  async attendMeetupDeprecated(
    @Param('meetupId', ParseIntPipe) meetupId: number,
    @ReqUser() user: UserEntity,
  ) {
    return this.meetupService.attendMeetup(meetupId, user);
  }

  @Delete(':meetupId/participation')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Удаление текущего пользователя из списка участников митапа',
  })
  @ApiSecurity('cookie-session')
  @ApiNotFoundResponse({
    description: 'Отсутствует митап с таким ID у текущего пользователя',
  })
  async leaveMeetup(
    @Param('meetupId', ParseIntPipe) meetupId: number,
    @ReqUser() user: UserEntity,
  ) {
    return this.meetupService.leaveMeetup(meetupId, user);
  }
}
