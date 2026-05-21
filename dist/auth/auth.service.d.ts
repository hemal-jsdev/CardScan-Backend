import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAiConfigDto } from './dto/update-ai-config.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signup(dto: SignupDto): Promise<{
        success: boolean;
        message: string;
        token: string;
        refreshToken: string;
        user: {
            id: number;
            uuid: string;
            fullName: string;
            email: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        success: boolean;
        message: string;
        token: string;
        refreshToken: string;
        user: {
            id: number;
            uuid: string;
            fullName: string;
            email: string;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        token: string;
        refreshToken: string;
        success: boolean;
        message: string;
    }>;
    private generateTokenPair;
    getAiConfig(userId: number): Promise<{
        success: boolean;
        geminiApiKey: string;
        geminiModel: string;
    }>;
    updateAiConfig(userId: number, dto: UpdateAiConfigDto): Promise<{
        success: boolean;
        message: string;
        geminiApiKey: string;
        geminiModel: string;
    }>;
}
