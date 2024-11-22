import { Module } from '@nestjs/common';
import { NotificationLogService } from './notification-log.service';
import { NotificationLogController } from './notification-log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationLog,
  NotificationLogSchema,
} from './notification-log.schema';
import {
  UserPreference,
  UserPreferenceSchema,
} from 'src/user-preference/user-preference.schema';

@Module({
  controllers: [NotificationLogController],
  providers: [NotificationLogService],
  imports: [
    MongooseModule.forFeature([
      { name: NotificationLog.name, schema: NotificationLogSchema },
      { name: UserPreference.name, schema: UserPreferenceSchema },
    ]),
  ],
})
export class NotificationLogModule {}
