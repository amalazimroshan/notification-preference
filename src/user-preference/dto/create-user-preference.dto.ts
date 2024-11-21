import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

class ChannelsDto {
  @IsBoolean()
  @IsOptional()
  email: boolean;

  @IsBoolean()
  @IsOptional()
  sms: boolean;

  @IsBoolean()
  @IsOptional()
  push: boolean;
}

class PreferencesDto {
  @IsBoolean()
  @IsOptional()
  marketing: boolean;

  @IsBoolean()
  @IsOptional()
  newsletter: boolean;

  @IsBoolean()
  @IsOptional()
  updates: boolean;

  @IsEnum(['daily', 'weekly', 'monthly', 'never'])
  @IsOptional()
  frequency: string;

  @IsObject()
  @IsOptional()
  channels: ChannelsDto;
}

export class CreateUserPreferenceDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsObject()
  @IsNotEmpty()
  preferences: PreferencesDto;

  @IsString()
  @IsNotEmpty()
  timezone: string;

  @IsDateString()
  @IsOptional()
  lastUpdated?: Date;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;
}
