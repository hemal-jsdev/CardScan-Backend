import { NotesService } from './notes.service';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    create(userId: number, cardId: number, content: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        cardId: number;
    }>;
    findAll(userId: number, cardId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        cardId: number;
    }[]>;
    update(userId: number, cardId: number, id: number, content: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        cardId: number;
    }>;
    remove(userId: number, cardId: number, id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        cardId: number;
    }>;
}
