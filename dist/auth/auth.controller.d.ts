import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateAiConfigDto } from './dto/update-ai-config.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    refresh(dto: RefreshTokenDto): Promise<{
        token: string;
        refreshToken: string;
        success: boolean;
        message: string;
    }>;
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
    getMe(user: {
        id: number;
        email: string;
        fullName: string;
    }): Promise<{
        success: boolean;
        user: {
            id: number;
            email: string;
            fullName: string;
        };
    }>;
    getAiConfig(user: {
        id: number;
    }): Promise<{
        success: boolean;
        geminiApiKey: string;
        geminiModel: string;
    }>;
    updateAiConfig(user: {
        id: number;
    }, dto: UpdateAiConfigDto): Promise<{
        success: boolean;
        message: string;
        geminiApiKey: string;
        geminiModel: string;
    }>;
}
