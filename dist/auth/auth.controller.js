"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const signup_dto_1 = require("./dto/signup.dto");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const update_ai_config_dto_1 = require("./dto/update-ai-config.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const get_user_decorator_1 = require("./decorators/get-user.decorator");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async refresh(dto) {
        return this.authService.refresh(dto.refreshToken);
    }
    async signup(dto) {
        return this.authService.signup(dto);
    }
    async login(dto) {
        return this.authService.login(dto);
    }
    async getMe(user) {
        return {
            success: true,
            user,
        };
    }
    async getAiConfig(user) {
        return this.authService.getAiConfig(user.id);
    }
    async updateAiConfig(user, dto) {
        return this.authService.updateAiConfig(user.id, dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using long-lived refresh token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tokens successfully refreshed.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or expired refresh token.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('signup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user account' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully created, returns session token.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid fields submitted.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already registered.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignupDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Log in with existing credentials' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Credentials verified successfully, returns session token.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials provided.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current authenticated user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Valid session, returns active profile metadata.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or expired access token.' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)('ai-config'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user Gemini configurations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gemini configurations returned.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or expired access token.' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAiConfig", null);
__decorate([
    (0, common_1.Patch)('ai-config'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user Gemini configurations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gemini configurations updated.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or expired access token.' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_ai_config_dto_1.UpdateAiConfigDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateAiConfig", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map