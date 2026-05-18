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
exports.CreateCardDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCardDto {
    fullName;
    firstName;
    lastName;
    jobTitle;
    department;
    company;
    companyWebsite;
    email;
    phoneWork;
    phoneMobile;
    phoneOther;
    address;
    city;
    state;
    country;
    postalCode;
    linkedIn;
    twitter;
    customFields;
    gstin;
    isBadge;
    rawExtractedText;
    frontImageUrl;
    backImageUrl;
    confidence;
}
exports.CreateCardDto = CreateCardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name extracted or entered', example: 'Aryan Dev Sharma' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Full Name is a mandatory field and cannot be blank.' }),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateCardDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name', required: false, example: 'Aryan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(75),
    __metadata("design:type", String)
], CreateCardDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name', required: false, example: 'Sharma' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(75),
    __metadata("design:type", String)
], CreateCardDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job title', required: false, example: 'Lead System Architect' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCardDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department name', required: false, example: 'Engineering Operations' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCardDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company name', required: false, example: 'Hindustan Tech Labs' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateCardDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company website URL', required: false, example: 'https://hindustantech.in' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "companyWebsite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', required: false, example: 'aryan.sharma@hindustantech.in' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Must be a valid Email pattern.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Work phone number', required: false, example: '+911204445555' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], CreateCardDto.prototype, "phoneWork", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mobile phone number', required: false, example: '+919876543210' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], CreateCardDto.prototype, "phoneMobile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Other phone number', required: false, example: '' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], CreateCardDto.prototype, "phoneOther", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full physical address', required: false, example: '402, Pinnacle Towers, Sector 62' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City', required: false, example: 'Noida' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCardDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State', required: false, example: 'Uttar Pradesh' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCardDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country', required: false, example: 'India' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCardDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Postal code', required: false, example: '201301' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateCardDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'LinkedIn profile link', required: false, example: 'https://linkedin.com/in/aryansharmalabs' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "linkedIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Twitter profile link', required: false, example: '' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "twitter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dynamic key-value attributes stored as a JSON object', required: false, example: { "Alternate Email": "aryan.personal@gmail.com" } }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCardDto.prototype, "customFields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indian GSTIN number', required: false, example: '09AAAAA1111A1Z1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(15),
    __metadata("design:type", String)
], CreateCardDto.prototype, "gstin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'True if card represents a Private QR Scanned user', default: false, example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCardDto.prototype, "isBadge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full raw text output from OCR scanner', required: false, example: 'Aryan Dev Sharma\nLead System Architect\nHindustan Tech Labs' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "rawExtractedText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cloud storage URL of the front image', required: false, example: '' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "frontImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cloud storage URL of the back image', required: false, example: '' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "backImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'OCR text recognition confidence rate (0.0 to 1.0)', default: 1.0, example: 0.96 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.0),
    (0, class_validator_1.Max)(1.0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCardDto.prototype, "confidence", void 0);
//# sourceMappingURL=create-card.dto.js.map