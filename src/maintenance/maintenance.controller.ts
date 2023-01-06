import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @ApiOperation({ summary: 'Регенерация БД' })
  @ApiQuery({
    name: 'admin_key',
    description: 'Ключ администрирования',
    required: false,
    example: 'admin_key',
  })
  @ApiOkResponse({ description: 'ok' })
  @Get('db-refresh')
  @UseGuards(AdminGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async refreshDatabase(@Query('admin_key') adminKey: string) {
    await this.maintenanceService.dbRefresh();
    return 'ok';
  }

  @ApiOperation({ summary: 'Ping сервера для Health check' })
  @ApiOkResponse({ description: 'pong' })
  @Get('ping')
  ping() {
    return this.maintenanceService.ping();
  }
}
