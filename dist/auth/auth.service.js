"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async signup(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException('A user with this email address already exists.');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const user = await this.prisma.user.create({
            data: {
                fullName: dto.fullName,
                email: dto.email.toLowerCase(),
                passwordHash,
            },
        });
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
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
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
    async refresh(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken);
            if (payload.type !== 'refresh') {
                throw new common_1.UnauthorizedException('Invalid token type.');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User session expired or user not found.');
            }
            const tokens = await this.generateTokenPair(user.id, user.email);
            return {
                success: true,
                message: 'Tokens refreshed successfully.',
                ...tokens,
            };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token.');
        }
    }
    async generateTokenPair(userId, email) {
        const accessPayload = { sub: userId, email, type: 'access' };
        const refreshPayload = { sub: userId, email, type: 'refresh' };
        const token = await this.jwtService.signAsync(accessPayload, { expiresIn: '15m' });
        const refreshToken = await this.jwtService.signAsync(refreshPayload, { expiresIn: '30d' });
        return { token, refreshToken };
    }
    async getAiConfig(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                geminiApiKey: true,
                geminiModel: true,
            },
        });
        return {
            success: true,
            geminiApiKey: user?.geminiApiKey || '',
            geminiModel: user?.geminiModel || 'gemini-3.1-flash-lite',
        };
    }
    async updateAiConfig(userId, dto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                geminiApiKey: dto.geminiApiKey,
                geminiModel: dto.geminiModel,
            },
        });
        return {
            success: true,
            message: 'AI Configuration successfully updated.',
            geminiApiKey: user.geminiApiKey || '',
            geminiModel: user.geminiModel || 'gemini-3.1-flash-lite',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map