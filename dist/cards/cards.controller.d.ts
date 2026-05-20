import { CardsService } from './cards.service';
import { CloudinaryService } from './cloudinary.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { QueryCardsDto } from './dto/query-cards.dto';
import { RefineAddressDto } from './dto/refine-address.dto';
import { ExtractVisionDto } from './dto/extract-vision.dto';
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
    refineAddress(refineAddressDto: RefineAddressDto): Promise<any>;
    extractVision(extractVisionDto: ExtractVisionDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
