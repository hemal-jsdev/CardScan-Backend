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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryCardsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class QueryCardsDto {
    page = 1;
    limit = 20;
    sortBy = 'date';
    sortOrder = 'desc';
    search;
    lowConfidence;
    hasGstin;
    missingContact;
    hasSocial;
    isBadge;
}
exports.QueryCardsDto = QueryCardsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pagination page number', default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryCardsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of records per page', default: 20, maximum: 100 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryCardsDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field to sort cards by', default: 'date', enum: ['date', 'name', 'company', 'confidence'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['date', 'name', 'company', 'confidence']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryCardsDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order of sorting', default: 'desc', enum: ['asc', 'desc'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['asc', 'desc']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryCardsDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fuzzy text query to search across fullName, company, email, and jobTitle' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryCardsDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter only low OCR confidence cards (< 50%)', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], QueryCardsDto.prototype, "lowConfidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter only cards containing a non-empty GSTIN number', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], QueryCardsDto.prototype, "hasGstin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter cards missing essential fields (e.g. "email,phone")', example: 'email,phone' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryCardsDto.prototype, "missingContact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter only cards with a LinkedIn or Twitter link', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], QueryCardsDto.prototype, "hasSocial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by Private QR scanned status' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], QueryCardsDto.prototype, "isBadge", void 0);
//# sourceMappingURL=query-cards.dto.js.map