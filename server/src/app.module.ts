import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { redisStore } from 'cache-manager-redis-yet'
import * as Joi from 'joi'
import { RedisClientOptions } from 'redis'
import { DataSource } from 'typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { baseUserConfig, cacheConfig, dbConfig, serverConfig } from './config'
import tokensConfig from './config/tokens.config'
import { AuthModule } from './modules/auth/auth.module'
import { DatabaseModule } from './modules/database/database.module'
import { SiteModule } from './modules/site/site.module'
import { UserModule } from './modules/user/user.module'

const ENV = process.env.NODE_ENV ?? 'development'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${ENV}`,
      load: [dbConfig, serverConfig, baseUserConfig, cacheConfig, tokensConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        PORT: Joi.number().default(5000),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
        BASE_USER_EMAIL: Joi.string().required(),
        BASE_USER_PASSWORD: Joi.string().required(),
      }),
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      url: 'redis://redis:6379',
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    SiteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
