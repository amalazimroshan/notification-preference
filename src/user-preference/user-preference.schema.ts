import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserPreferenceDocument = HydratedDocument<UserPreference>;

@Schema({ _id: false })
class Channels {
  @Prop({ required: true, default: false })
  email: boolean;

  @Prop({ required: true, default: false })
  sms: boolean;

  @Prop({ required: true, default: false })
  push: boolean;
}

@Schema({ _id: false })
class Preferences {
  @Prop({ required: true, default: false })
  marketing: boolean;

  @Prop({ required: true, default: false })
  newsletter: boolean;

  @Prop({ required: true, default: false })
  updates: boolean;

  @Prop({
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'never'],
    default: 'never',
  })
  frequency: string;

  @Prop({ type: Channels, required: true })
  channels: Channels;
}

@Schema()
export class UserPreference {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: Preferences, required: true })
  preferences: Preferences;

  @Prop({ required: true })
  timezone: string;

  @Prop({ required: true, default: Date.now() })
  lastUpdated: Date;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;
}

export const UserPreferenceSchema =
  SchemaFactory.createForClass(UserPreference);
