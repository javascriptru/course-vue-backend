import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { MeetupsModule } from './meetups/meetups.module';
import { UsersModule } from './users/users.module';
import { ImagesModule } from './images/images.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import config from './mikro-orm.config';
import { configuration } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const clientPath = configService.get('clientPath');
        return clientPath
          ? [
              {
                rootPath: configService.get('clientPath'),
                exclude: ['/api*'],
              },
            ]
          : [];
      },
      inject: [ConfigService],
    }),
    MikroOrmModule.forRoot(config),
    ScheduleModule.forRoot(),
    AuthModule,
    MeetupsModule,
    UsersModule,
    ImagesModule,
    MaintenanceModule,
  ],
})
export class AppModule {}
