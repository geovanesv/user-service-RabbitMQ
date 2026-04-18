import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres-user',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'userdb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PassportModule,
    UserModule,
    AuthModule,
    MessagingModule,
  ],
})
export class AppModule {}
