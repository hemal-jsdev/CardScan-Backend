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
exports.CardsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const cards_service_1 = require("./cards.service");
const cloudinary_service_1 = require("./cloudinary.service");
const create_card_dto_1 = require("./dto/create-card.dto");
const update_card_dto_1 = require("./dto/update-card.dto");
const query_cards_dto_1 = require("./dto/query-cards.dto");
const refine_address_dto_1 = require("./dto/refine-address.dto");
const extract_vision_dto_1 = require("./dto/extract-vision.dto");
let CardsController = class CardsController {
    cardsService;
    cloudinaryService;
    constructor(cardsService, cloudinaryService) {
        this.cardsService = cardsService;
        this.cloudinaryService = cloudinaryService;
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('Multipart upload failed: no file was supplied.');
        }
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        return {
            success: true,
            message: 'Image successfully uploaded to Cloudinary.',
            url: imageUrl,
        };
    }
    async create(userId, createCardDto) {
        return this.cardsService.create(userId, createCardDto);
    }
    async findAll(userId, query) {
        return this.cardsService.findAll(userId, query);
    }
    async export(userId, query, res) {
        return this.cardsService.exportToExcel(userId, query, res);
    }
    async update(userId, id, updateCardDto) {
        return this.cardsService.update(userId, id, updateCardDto);
    }
    async remove(userId, id) {
        return this.cardsService.remove(userId, id);
    }
    async refineAddress(refineAddressDto) {
        return this.cardsService.refineAddress(refineAddressDto.address);
    }
    async extractVision(extractVisionDto) {
        return this.cardsService.extractVision(extractVisionDto.imageBase64);
    }
};
exports.CardsController = CardsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upload card image to Cloudinary storage' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "uploadFile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new business card contact' }),
    (0, common_1.Post)(),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_card_dto_1.CreateCardDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get business cards list with pagination and advanced filtering' }),
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, query_cards_dto_1.QueryCardsDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Export matching business cards to Microsoft Excel' }),
    (0, common_1.Get)('export'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, query_cards_dto_1.QueryCardsDto, Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "export", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing business card contact details' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, update_card_dto_1.UpdateCardDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a business card permanently' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Refine a raw scanned address using Gemini' }),
    (0, common_1.Post)('refine-address'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refine_address_dto_1.RefineAddressDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "refineAddress", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Extract details from a business card image using Gemini Vision' }),
    (0, common_1.Post)('extract-vision'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [extract_vision_dto_1.ExtractVisionDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "extractVision", null);
exports.CardsController = CardsController = __decorate([
    (0, swagger_1.ApiTags)('Business Cards'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('cards'),
    __metadata("design:paramtypes", [cards_service_1.CardsService,
        cloudinary_service_1.CloudinaryService])
], CardsController);
//# sourceMappingURL=cards.controller.js.map