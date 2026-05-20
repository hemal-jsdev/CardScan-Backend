import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { QueryCardsDto } from './dto/query-cards.dto';
import { Response } from 'express';
export declare class CardsService {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    private parseCustomFields;
    private mapCardResponse;
    create(userId: number, dto: CreateCardDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    update(userId: number, id: number, dto: UpdateCardDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(userId: number, id: number): Promise<{
        success: boolean;
        message: string;
        deletedCardId: number;
    }>;
    private buildWhereClause;
    findAll(userId: number, query: QueryCardsDto): Promise<{
        success: boolean;
        message: string;
        pagination: {
            currentPage: number;
            pageSize: number;
            totalPages: number;
            totalCount: number;
        };
        data: any[];
    }>;
    exportToExcel(userId: number, query: QueryCardsDto, response: Response): Promise<void>;
    refineAddress(rawAddress: string): Promise<any>;
    extractVision(imageBase64: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
