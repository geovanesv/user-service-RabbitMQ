import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto, AuthResponseDto } from './dto/auth.dto';

export interface JwtPayload {
  email: string;
  sub: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      const user = await this.userService.findByEmail(loginDto.email);

      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      const isValidPassword = await this.userService.validatePassword(
        loginDto.password,
        user.password,
      );

      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: JwtPayload = {
        email: user.email,
        sub: user.id,
      };

      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Login failed');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user.isActive) {
        return null;
      }

      const isValidPassword = await this.userService.validatePassword(
        password,
        user.password,
      );

      if (isValidPassword) {
        const { password, ...result } = user;
        return result;
      }
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
    return null;
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid token');
      }

      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(user: any): Promise<{ access_token: string }> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
