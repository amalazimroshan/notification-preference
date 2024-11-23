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
import { Cron } from '@nestjs/schedule';

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
    const response = {
      success: {
        total: 0,
        sms: 0,
        email: 0,
        push: 0,
      },
      failed: {
        total: 0,
        sms: 0,
        email: 0,
        push: 0,
      },
    };

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

      // create valid candidates from the list
      const notificationLogs = types
        .flatMap((type) => {
          if (user.preferences[type]) {
            return channels
              .flatMap((channel) => {
                if (user.preferences.channels[channel]) {
                  return {
                    userId: user.userId,
                    type: type,
                    channel: channel,
                    status: 'pending',
                    sentAt: new Date(),
                    metadata: { sim: true },
                  };
                }
              })
              .filter(Boolean);
          }
        })
        .filter(Boolean);

      try {
        await Promise.all(
          notificationLogs.map(async (log) => {
            try {
              log.status = 'sent'; // update dynamically on notification sent state
              await this.notificationLogModel.create(log);
              response.success[log.channel]++;
              response.success.total++;
            } catch (error) {
              this.logger.warn(
                `error in senting notification to ${user.userId} on channel ${log.channel} error:${error}`,
              );
              response.failed[log.channel]++;
              response.failed.total++;
            }
          }),
        );
        this.logger.log(
          `Sending ${frequency} notification to ${user.email} for preferences: ${JSON.stringify(
            user.preferences,
          )} `,
        );
      } catch (error) {
        this.logger.warn(`sent notification to ${user.email}: error:${error} `);
      }
    }
    return response;
  }

  @Cron('45 * * * * *')
  // @Cron('0 0 * * *')  call everyday midnight
  async handleNotifications() {
    this.logger.debug('Sending notifications to world');
    this.sendNotificaions();
  }
}
