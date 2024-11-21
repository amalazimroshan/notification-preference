import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { NotificationLogService } from './notification-log.service';
import { CreateNotificationLogDto } from './dto/create-notification-log.dto';

@Controller('notifications')
export class NotificationLogController {
  constructor(
    private readonly notificationLogService: NotificationLogService,
  ) {}

  @Post('send')
  async sendNotification(
    @Body() createNotificationLogDto: CreateNotificationLogDto,
  ) {
    return this.notificationLogService.create(createNotificationLogDto);
  }

  @Get(':userId/logs')
  async getUserNotificationLogs(@Param('userId') userId: string) {
    return this.notificationLogService.getUserLogs(userId);
  }

  @Get('stats')
  async getNotificationStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.notificationLogService.getStats({ startDate, endDate });
  }
}
