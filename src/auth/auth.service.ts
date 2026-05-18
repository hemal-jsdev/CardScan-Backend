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

    // 4. Generate JWT token
    const token = await this.generateToken(user.id, user.email);

    return {
      success: true,
      message: 'Account successfully registered.',
      token,
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

    // 3. Generate JWT token
    const token = await this.generateToken(user.id, user.email);

    return {
      success: true,
      message: 'Successfully logged in.',
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }

  private async generateToken(userId: number, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.signAsync(payload);
  }
}
