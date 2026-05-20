import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async verifyCardOwnership(userId: number, cardId: number) {
    const card = await this.prisma.businessCard.findUnique({
      where: { id: cardId },
    });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    if (card.userId !== userId) {
      throw new UnauthorizedException('Not authorized to access notes for this card');
    }
  }

  async create(userId: number, cardId: number, content: string) {
    await this.verifyCardOwnership(userId, cardId);
    return this.prisma.note.create({
      data: {
        cardId,
        content,
      },
    });
  }

  async findAll(userId: number, cardId: number) {
    await this.verifyCardOwnership(userId, cardId);
    return this.prisma.note.findMany({
      where: { cardId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(userId: number, cardId: number, id: number, content: string) {
    await this.verifyCardOwnership(userId, cardId);
    const note = await this.prisma.note.findFirst({ where: { id, cardId } });
    if (!note) throw new NotFoundException('Note not found');
    
    return this.prisma.note.update({
      where: { id },
      data: { content },
    });
  }

  async remove(userId: number, cardId: number, id: number) {
    await this.verifyCardOwnership(userId, cardId);
    const note = await this.prisma.note.findFirst({ where: { id, cardId } });
    if (!note) throw new NotFoundException('Note not found');

    return this.prisma.note.delete({
      where: { id },
    });
  }
}
