import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { UserModule } from '../user/user.module'
import { XApiKeyModule } from '../x-api-key/x-api-key.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies'
import { HeaderApiKeyStrategy } from './strategies/headerApiKey.strategy'

@Module({
  imports: [JwtModule.register({}), UserModule, ConfigModule, XApiKeyModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, HeaderApiKeyStrategy],
})
export class AuthModule {}
