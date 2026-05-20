import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    // 1. Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException('A user with this email address already exists.');
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // 3. Create user record
    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email.toLowerCase(),
        passwordHash,
      },
    });

    // 4. Generate JWT token pair
    const { token, refreshToken } = await this.generateTokenPair(user.id, user.email);

    return {
      success: true,
      message: 'Account successfully registered.',
      token,
      refreshToken,
      user: {
        id: user.id,
        uuid: user.uuid,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto) {
    // 1. Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // 2. Check password matches
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // 3. Generate JWT token pair
    const { token, refreshToken } = await this.generateTokenPair(user.id, user.email);

    return {
      success: true,
      message: 'Successfully logged in.',
      token,
      refreshToken,
      user: {
        id: user.id,
        uuid: user.uuid,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type.');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('User session expired or user not found.');
      }

      const tokens = await this.generateTokenPair(user.id, user.email);
      return {
        success: true,
        message: 'Tokens refreshed successfully.',
        ...tokens,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  private async generateTokenPair(userId: number, email: string) {
    const accessPayload = { sub: userId, email, type: 'access' };
    const refreshPayload = { sub: userId, email, type: 'refresh' };

    const token = await this.jwtService.signAsync(accessPayload, { expiresIn: '15m' });
    const refreshToken = await this.jwtService.signAsync(refreshPayload, { expiresIn: '30d' });

    return { token, refreshToken };
  }
}
