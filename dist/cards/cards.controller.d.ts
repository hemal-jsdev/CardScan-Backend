import { CardsService } from './cards.service';
import { CloudinaryService } from './cloudinary.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { QueryCardsDto } from './dto/query-cards.dto';
export declare class CardsController {
    private readonly cardsService;
    private readonly cloudinaryService;
    constructor(cardsService: CardsService, cloudinaryService: CloudinaryService);
    uploadFile(file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        url: string;
    }>;
    create(userId: number, createCardDto: CreateCardDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
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
    export(userId: number, query: QueryCardsDto, res: any): Promise<void>;
    renderSharePage(id: number, res: any): Promise<any>;
    downloadVCard(id: number, res: any): Promise<any>;
    update(userId: number, id: number, updateCardDto: UpdateCardDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(userId: number, id: number): Promise<{
        success: boolean;
        message: string;
        deletedCardId: number;
    }>;
    private generateVCardString;
    private generateSvgQr;
    private generateShareHtml;
}
