import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User successfully created, returns session token.' })
  @ApiResponse({ status: 400, description: 'Invalid fields submitted.' })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with existing credentials' })
  @ApiResponse({ status: 200, description: 'Credentials verified successfully, returns session token.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials provided.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Valid session, returns active profile metadata.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired access token.' })
  async getMe(@GetUser() user: { id: number; email: string; fullName: string }) {
    return {
      success: true,
      user,
    };
  }
}
