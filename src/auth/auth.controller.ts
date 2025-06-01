import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, AuthResponseDto } from './dto/auth.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login-passport')
  @HttpCode(HttpStatus.OK)
  async loginWithPassport(@Request() req): Promise<AuthResponseDto> {
    // Este endpoint usa o LocalStrategy para validação
    const loginDto: LoginDto = {
      email: req.user.email,
      password: '', // Password já foi validada pelo strategy
    };

    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: 'User profile retrieved successfully',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // Em uma implementação real, você poderia invalidar o token
    // adicionando-o a uma blacklist no Redis, por exemplo
    return {
      message: 'Logout successful',
      statusCode: HttpStatus.OK,
    };
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body('token') token: string) {
    try {
      const user = await this.authService.validateToken(token);
      return {
        valid: true,
        user,
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Invalid token',
      };
    }
  }
}
