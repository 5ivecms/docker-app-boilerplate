import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'

import { CreateUserDto } from '../user/dto'
import { AuthService } from './auth.service'
import { AuthDto, ChangePasswordDto } from './dto'
import { AccessTokenGuard, RefreshTokenGuard } from './guards'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto)
  }

  @Post('signin')
  public signIn(@Body() data: AuthDto) {
    return this.authService.signIn(data)
  }

  @UseGuards(AccessTokenGuard)
  @Post('change-password')
  public changePassword(@Body() data: ChangePasswordDto, @Req() req: Request) {
    const userId = req.user['sub']
    return this.authService.changePassword(data, userId)
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  public logout(@Req() req: Request) {
    this.authService.logout(req.user['sub'])
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  public refreshTokens(@Req() req: Request) {
    const userId = req.user['sub']
    const refreshToken = req.user['refreshToken']

    return this.authService.refreshTokens(Number(userId), refreshToken)
  }
}
