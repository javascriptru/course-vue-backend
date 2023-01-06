import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiPayloadTooLargeResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { ImageDto } from './dto/Image.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { fileFilter } from './image-file.filter';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ReqUser } from '../common/decorators/user.decorator';
import { UserEntity } from '../users/user.entity';

@ApiTags('Images')
@Controller('images')
@UseInterceptors(ClassSerializerInterceptor)
export class ImagesController {
  constructor(
    @Inject(ImagesService) private readonly imagesService: ImagesService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('file', { fileFilter }))
  @ApiOperation({ summary: 'Загрузка изображения' })
  @ApiSecurity('cookie-session')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Изображение',
    type: FileUploadDto,
  })
  @ApiCreatedResponse({
    description: 'Изображение успешно сохранено',
    type: ImageDto,
  })
  @ApiBadRequestResponse({ description: 'Ошибка загрузки изображения' })
  @ApiPayloadTooLargeResponse({ description: 'Изображение слишком большое' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @ReqUser() user: UserEntity,
  ): Promise<ImageDto> {
    if (!file) {
      throw new BadRequestException('Ошибка получения файла');
    }
    const image = await this.imagesService.saveImage(file, user);
    return new ImageDto(image, this.configService.get('publicUrl'));
  }

  @Get(':image')
  @ApiOkResponse({ content: { 'image/*': { schema: { type: 'file' } } } })
  @ApiParam({
    name: 'image',
    description: 'Имя изображения: ID изображения опционально с расширением',
    examples: {
      'imageId.extension': {
        value: '1.jpeg',
        description: 'Получение изображения по Image ID с расширением',
      },
      imageId: {
        value: '1',
        description: 'Получение изображения по Image ID без расширения',
      },
    },
  })
  @ApiOperation({ summary: 'Получение изображения' })
  async getImage(@Param('image') imageId: number | string, @Res() res) {
    const image = await this.imagesService.getImage(imageId);
    if (!image) {
      throw new NotFoundException();
    }
    res.set('content-type', image.mimetype);
    res.send(image.data);
  }
}
