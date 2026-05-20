import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('cards/:cardId/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(
    @GetUser('userId') userId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body('content') content: string,
  ) {
    return this.notesService.create(userId, cardId, content);
  }

  @Get()
  findAll(
    @GetUser('userId') userId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
  ) {
    return this.notesService.findAll(userId, cardId);
  }

  @Put(':id')
  update(
    @GetUser('userId') userId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ) {
    return this.notesService.update(userId, cardId, id, content);
  }

  @Delete(':id')
  remove(
    @GetUser('userId') userId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notesService.remove(userId, cardId, id);
  }
}
