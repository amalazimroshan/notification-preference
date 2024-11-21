import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  ValidateIf,
} from 'class-validator';
import {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from '../notification-log.schema';

export class CreateNotificationLogDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  @IsOptional()
  sentAt?: Date;

  @ValidateIf((o) => o.status === NotificationStatus.FAILED)
  @IsString()
  failureReason?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
