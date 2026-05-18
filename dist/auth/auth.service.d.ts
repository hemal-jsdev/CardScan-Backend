import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signup(dto: SignupDto): Promise<{
        success: boolean;
        message: string;
        token: string;
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
        user: {
            id: number;
            uuid: string;
            fullName: string;
            email: string;
        };
    }>;
    private generateToken;
}
