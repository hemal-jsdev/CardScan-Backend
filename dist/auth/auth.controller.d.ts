import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
}
