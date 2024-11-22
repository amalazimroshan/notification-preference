import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationLog,
  NotificationLogSchema,
} from 'src/notification-log/notification-log.schema';
import {
  UserPreference,
  UserPreferenceSchema,
} from 'src/user-preference/user-preference.schema';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [
    MongooseModule.forFeature([
      { name: NotificationLog.name, schema: NotificationLogSchema },
      { name: UserPreference.name, schema: UserPreferenceSchema },
    ]),
  ],
})
export class NotificationsModule {}
