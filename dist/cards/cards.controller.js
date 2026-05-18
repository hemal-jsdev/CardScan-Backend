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
    async renderSharePage(id, res) {
        const card = await this.cardsService.findOnePublic(id);
        const html = this.generateShareHtml(card);
        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
    }
    async downloadVCard(id, res) {
        const card = await this.cardsService.findOnePublic(id);
        const vcard = this.generateVCardString(card);
        const fileName = `${card.fullName.replace(/\s+/g, '_')}_contact.vcf`;
        res.setHeader('Content-Type', 'text/vcard');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.send(vcard);
    }
    async update(userId, id, updateCardDto) {
        return this.cardsService.update(userId, id, updateCardDto);
    }
    async remove(userId, id) {
        return this.cardsService.remove(userId, id);
    }
    generateVCardString(card) {
        return [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${card.fullName}`,
            `N:${card.lastName || ''};${card.firstName || ''};;;`,
            `ORG:${card.company || ''}`,
            `TITLE:${card.jobTitle || ''}`,
            `EMAIL;TYPE=PREF,INTERNET:${card.email || ''}`,
            `TEL;TYPE=CELL,VOICE:${card.phoneMobile || ''}`,
            `TEL;TYPE=WORK,VOICE:${card.phoneWork || ''}`,
            `ADR;TYPE=WORK:;;${card.address || ''};${card.city || ''};${card.state || ''};${card.postalCode || ''};${card.country || ''}`,
            `URL:${card.companyWebsite || ''}`,
            'END:VCARD'
        ].join('\r\n');
    }
    generateSvgQr(name) {
        const size = 150;
        const cols = 11;
        const dotSize = size / cols;
        const getFinderPattern = (x, y) => {
            return `
        <rect x="${x}" y="${y}" width="${dotSize * 3}" height="${dotSize * 3}" rx="${dotSize * 0.6}" fill="#00E5FF"/>
        <rect x="${x + dotSize * 0.5}" y="${y + dotSize * 0.5}" width="${dotSize * 2}" height="${dotSize * 2}" rx="${dotSize * 0.4}" fill="#0F1326"/>
        <rect x="${x + dotSize * 0.9}" y="${y + dotSize * 0.9}" width="${dotSize * 1.2}" height="${dotSize * 1.2}" rx="${dotSize * 0.2}" fill="#00E5FF"/>
      `;
        };
        let svgContent = '';
        svgContent += getFinderPattern(0, 0);
        svgContent += getFinderPattern(size - dotSize * 3, 0);
        svgContent += getFinderPattern(0, size - dotSize * 3);
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const nextRandom = () => {
            const x = Math.sin(hash++) * 10000;
            return x - Math.floor(x);
        };
        for (let row = 0; row < cols; row++) {
            for (let col = 0; col < cols; col++) {
                if (row < 4 && col < 4)
                    continue;
                if (row < 4 && col >= 7)
                    continue;
                if (row >= 7 && col < 4)
                    continue;
                if (nextRandom() > 0.5) {
                    const color = nextRandom() > 0.45 ? '#A855F7' : '#00E5FF';
                    svgContent += `<rect x="${col * dotSize + dotSize * 0.15}" y="${row * dotSize + dotSize * 0.15}" width="${dotSize * 0.7}" height="${dotSize * 0.7}" rx="${dotSize * 0.25}" fill="${color}"/>`;
                }
            }
        }
        return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
    }
    generateShareHtml(card) {
        const initials = card.fullName.split(' ')
            .filter((s) => s.length > 0)
            .slice(0, 2)
            .map((s) => s[0])
            .join('')
            .toUpperCase() || 'CS';
        const qrSvg = this.generateSvgQr(card.fullName);
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${card.fullName} | Business Card Exchange</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-deep: #070913;
            --navy-card: #0F1326;
            --cyan-accent: #00E5FF;
            --purple-accent: #A855F7;
            --text-primary: #FFFFFF;
            --text-secondary: #94A3B8;
            --border-color: rgba(255, 255, 255, 0.08);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-deep);
            color: var(--text-primary);
            font-family: 'Outfit', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow-x: hidden;
            position: relative;
            padding: 20px;
        }

        /* Ambient Glow Effects */
        .ambient-glow {
            position: absolute;
            width: 350px;
            height: 350px;
            border-radius: 50%;
            filter: blur(120px);
            opacity: 0.15;
            z-index: 1;
            pointer-events: none;
        }

        .glow-cyan {
            background-color: var(--cyan-accent);
            top: 10%;
            left: -10%;
            animation: float 12s ease-in-out infinite alternate;
        }

        .glow-purple {
            background-color: var(--purple-accent);
            bottom: 10%;
            right: -10%;
            animation: float 8s ease-in-out infinite alternate-reverse;
        }

        @keyframes float {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(30px) scale(1.1); }
        }

        /* Card Container */
        .wrapper {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 580px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .card-container {
            background: linear-gradient(135deg, #13172E 0%, #0A0D1F 100%);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            padding: 32px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            position: relative;
            overflow: hidden;
        }

        .card-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--cyan-accent), var(--purple-accent), transparent);
            opacity: 0.3;
        }

        /* Glassmorphic elements */
        .card-content {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 32px;
        }

        @media (max-width: 500px) {
            .card-content {
                flex-direction: column;
                text-align: center;
                gap: 28px;
            }
        }

        /* Details side */
        .details-col {
            display: flex;
            flex-direction: column;
            gap: 16px;
            flex: 1;
        }

        .monogram {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(168, 85, 247, 0.08);
            border: 1.5px solid var(--cyan-accent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 18px;
            letter-spacing: 0.5px;
            color: var(--cyan-accent);
            box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);
        }

        @media (max-width: 500px) {
            .monogram {
                margin: 0 auto;
            }
        }

        .identity h1 {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
            line-height: 1.2;
            margin-bottom: 4px;
        }

        .job-title {
            color: var(--cyan-accent);
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-bottom: 2px;
        }

        .company {
            color: var(--text-secondary);
            font-size: 14px;
            font-weight: 600;
        }

        /* Contact Details list */
        .contact-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 8px;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13.5px;
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .contact-item:hover {
            color: var(--text-primary);
        }

        .contact-icon {
            color: var(--cyan-accent);
            width: 16px;
            height: 16px;
            opacity: 0.8;
            flex-shrink: 0;
        }

        /* QR Side */
        .qr-col {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            background: rgba(0, 0, 0, 0.25);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 16px;
            box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
            flex-shrink: 0;
        }

        .qr-label {
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 0.8px;
            color: var(--cyan-accent);
        }

        /* Glowing Action Button */
        .cta-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
            background: linear-gradient(90deg, var(--cyan-accent) 0%, var(--purple-accent) 100%);
            border: none;
            border-radius: 16px;
            padding: 18px 24px;
            font-size: 16px;
            font-weight: 800;
            color: #FFFFFF;
            text-decoration: none;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(168, 85, 247, 0.3);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
        }

        .cta-btn::after {
            content: '';
            position: absolute;
            top: 0;
            left: -50%;
            width: 200%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transform: skewX(-20deg);
            transition: 0.75s;
        }

        .cta-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(0, 229, 255, 0.4);
        }

        .cta-btn:hover::after {
            left: 120%;
        }

        .cta-icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        /* Footer info */
        .footer-text {
            text-align: center;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.25);
            font-weight: 600;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div class="ambient-glow glow-cyan"></div>
    <div class="ambient-glow glow-purple"></div>

    <div class="wrapper">
        <!-- Business Card Glassmorphic container -->
        <div class="card-container">
            <div class="card-content">
                <!-- Details column -->
                <div class="details-col">
                    <div class="monogram">${initials}</div>
                    
                    <div class="identity">
                        <h1>${card.fullName || 'Business Contact'}</h1>
                        <p class="job-title">${card.jobTitle || 'Executive Associate'}</p>
                        <p class="company">${card.company || 'Enterprise Corporation'}</p>
                    </div>

                    <div class="contact-list">
                        ${card.email ? `
                        <a href="mailto:${card.email}" class="contact-item">
                            <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            ${card.email}
                        </a>` : ''}

                        ${card.phoneMobile ? `
                        <a href="tel:${card.phoneMobile}" class="contact-item">
                            <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.3 11.3 0 005.455 5.456l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            ${card.phoneMobile} (Mobile)
                        </a>` : ''}

                        ${card.phoneWork ? `
                        <a href="tel:${card.phoneWork}" class="contact-item">
                            <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                            </svg>
                            ${card.phoneWork} (Work)
                        </a>` : ''}

                        ${card.address ? `
                        <div class="contact-item">
                            <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                            </svg>
                            <span>${card.address}${card.city ? `, ${card.city}` : ''}${card.state ? `, ${card.state}` : ''}</span>
                        </div>` : ''}
                    </div>
                </div>

                <!-- QR Vector column -->
                <div class="qr-col">
                    ${qrSvg}
                    <div class="qr-label">DIGITAL ID MATRIX</div>
                </div>
            </div>
        </div>

        <!-- Download Action -->
        <a href="/api/cards/share/${card.id}/vcard" class="cta-btn">
            <svg class="cta-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Save Contact to Phone
        </a>

        <!-- Footer -->
        <div class="footer-text">POWERED BY WHITE TURTLE CARDSCAN</div>
    </div>
</body>
</html>
`;
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "uploadFile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new business card contact' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_card_dto_1.CreateCardDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get business cards list with pagination and advanced filtering' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, query_cards_dto_1.QueryCardsDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Export matching business cards to Microsoft Excel' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('export'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, query_cards_dto_1.QueryCardsDto, Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "export", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a business card sharing landing page' }),
    (0, common_1.Get)('share/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "renderSharePage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Download business card contact details as a vCard file' }),
    (0, common_1.Get)('share/:id/vcard'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "downloadVCard", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing business card contact details' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "remove", null);
exports.CardsController = CardsController = __decorate([
    (0, swagger_1.ApiTags)('Business Cards'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('cards'),
    __metadata("design:paramtypes", [cards_service_1.CardsService,
        cloudinary_service_1.CloudinaryService])
], CardsController);
//# sourceMappingURL=cards.controller.js.map