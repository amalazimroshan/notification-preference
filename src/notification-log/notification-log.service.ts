import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationLogDto } from './dto/create-notification-log.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  NotificationLog,
  NotificationLogDocument,
} from './notification-log.schema';
import { Model } from 'mongoose';
import {
  UserPreference,
  UserPreferenceDocument,
} from 'src/user-preference/user-preference.schema';

@Injectable()
export class NotificationLogService {
  constructor(
    @InjectModel(NotificationLog.name)
    private readonly notificationLogModel: Model<NotificationLogDocument>,

    @InjectModel(UserPreference.name)
    private readonly userPreferenceModel: Model<UserPreferenceDocument>,
  ) {}

  async validateUserId(userId: string): Promise<boolean> {
    try {
      const userPreference = await this.userPreferenceModel.findOne({ userId });
      console.log(userPreference);

      return !!userPreference;
    } catch (error) {
      console.error(
        `user with id:${userId} is not found in the database: ${error}`,
      );
      return false;
    }
  }

  async create(
    createNotificationLogDto: CreateNotificationLogDto,
  ): Promise<NotificationLog> {
    const isValidUser = await this.validateUserId(
      createNotificationLogDto.userId,
    );
    console.log(isValidUser);

    if (!isValidUser) {
      throw new BadRequestException(`Invalid userId provided`);
    }

    const notificationLog = new this.notificationLogModel(
      createNotificationLogDto,
    );
    return notificationLog.save();
  }

  async getUserLogs(userId: string): Promise<NotificationLog[]> {
    const query: Record<string, any> = { userId };
    const logs = await this.notificationLogModel.find(query).exec();
    if (!logs || logs.length === 0) {
      throw new NotFoundException(`No logs found for user ${userId}`);
    }

    return logs;
  }
  async getStats(filters: { startDate?: string; endDate?: string }) {
    const query: Record<string, any> = {};
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    const stats = await this.notificationLogModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: { type: '$type', channel: '$channel', status: '$status' },
          count: { $sum: 1 },
        },
      },
    ]);

    return stats.map((stat) => ({
      type: stat._id.type,
      channel: stat._id.channel,
      status: stat._id.status,
      count: stat.count,
    }));
  }
}
