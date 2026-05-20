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
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotesService = class NotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyCardOwnership(userId, cardId) {
        const card = await this.prisma.businessCard.findUnique({
            where: { id: cardId },
        });
        if (!card) {
            throw new common_1.NotFoundException('Card not found');
        }
        if (card.userId !== userId) {
            throw new common_1.UnauthorizedException('Not authorized to access notes for this card');
        }
    }
    async create(userId, cardId, content) {
        await this.verifyCardOwnership(userId, cardId);
        return this.prisma.note.create({
            data: {
                cardId,
                content,
            },
        });
    }
    async findAll(userId, cardId) {
        await this.verifyCardOwnership(userId, cardId);
        return this.prisma.note.findMany({
            where: { cardId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(userId, cardId, id, content) {
        await this.verifyCardOwnership(userId, cardId);
        const note = await this.prisma.note.findFirst({ where: { id, cardId } });
        if (!note)
            throw new common_1.NotFoundException('Note not found');
        return this.prisma.note.update({
            where: { id },
            data: { content },
        });
    }
    async remove(userId, cardId, id) {
        await this.verifyCardOwnership(userId, cardId);
        const note = await this.prisma.note.findFirst({ where: { id, cardId } });
        if (!note)
            throw new common_1.NotFoundException('Note not found');
        return this.prisma.note.delete({
            where: { id },
        });
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotesService);
//# sourceMappingURL=notes.service.js.map