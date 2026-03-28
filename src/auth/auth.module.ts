import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JWTStrategy } from './strategies/jwt.strategy';
import { JwtGuard } from './Guards/jwt.guards';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret-key',
      signOptions: { expiresIn: '15min' }
    }),
    UserModule
  ],
  providers: [AuthService, JWTStrategy, JwtGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
