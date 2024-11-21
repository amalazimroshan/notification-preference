import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserPreferenceModule } from './user-preference/user-preference.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationLogModule } from './notification-log/notification-log.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    UserPreferenceModule,
    NotificationLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
