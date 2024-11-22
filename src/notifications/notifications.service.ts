import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NotificationLog,
  NotificationLogDocument,
} from 'src/notification-log/notification-log.schema';
import {
  UserPreference,
  UserPreferenceDocument,
} from 'src/user-preference/user-preference.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(UserPreference.name)
    private readonly userPreferenceModel: Model<UserPreferenceDocument>,

    @InjectModel(NotificationLog.name)
    private readonly notificationLogModel: Model<NotificationLogDocument>,
  ) {}

  private readonly logger = new Logger(NotificationsService.name, {
    timestamp: true,
  });

  async sendNotificaions() {
    const now = new Date();
    const frequencyMapping = {
      daily: new Date(now.setDate(now.getDate() - 1)),
      weekly: new Date(now.setDate(now.getDate() - 7)),
      monthly: new Date(now.setDate(now.getMonth() - 1)),
    };

    const users = await this.userPreferenceModel.find({
      $or: [
        { 'preferences.newsletter': true },
        { 'preferences.marketing': true },
        { 'preferences.updates': true },
      ],
    });

    for (const user of users) {
      const lastSent = await this.notificationLogModel
        .findOne({
          userId: user.userId,
        })
        .sort({ sentAt: -1 });

      const frequency = user.preferences.frequency;
      if (lastSent && lastSent.sentAt > frequencyMapping[frequency]) continue;

      const types = ['marketing', 'newsletter', 'updates'];
      const channels = ['email', 'sms', 'push'];

      const notificationLogs = types.map((type) => {
        return channels.map((channel) => ({
          userId: user.userId,
          type: type,
          channel: channel,
          status: 'sent',
          sentAt: new Date(),
          metadata: { sim: true },
        }));
      });

      await Promise.all(
        notificationLogs.map((log) => this.notificationLogModel.create(log)),
      );

      this.logger.log(
        `Sending ${frequency} notification to ${user.email} for preferences: ${JSON.stringify(
          user.preferences,
        )} `,
      );
    }

    return 'manual send notification done successfully';
  }
}
