import { EntityManager } from '@mikro-orm/core';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DatabaseManager } from './database-manager';

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger('Maintenance');

  constructor(
    private readonly em: EntityManager,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,

    @Inject('DATABASE_MANAGER')
    private readonly databaseManager: DatabaseManager,
  ) {
    const dbRefreshCronPattern = this.configService.get('dbRefreshCron');
    if (dbRefreshCronPattern) {
      const dbRefreshJob = new CronJob(dbRefreshCronPattern, () => {
        return this.dbRefresh();
      });
      this.schedulerRegistry.addCronJob('db-refresh', dbRefreshJob);
      dbRefreshJob.start();
    }
  }

  ping() {
    return 'pong';
  }

  async dbRefresh() {
    try {
      await this.databaseManager.refresh(this.em);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException('Error on DB refresh');
    }
  }
}
