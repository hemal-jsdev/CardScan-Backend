import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile, 
  ParseIntPipe, 
  Res,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CardsService } from './cards.service';
import { CloudinaryService } from './cloudinary.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { QueryCardsDto } from './dto/query-cards.dto';
import { RefineAddressDto } from './dto/refine-address.dto';
import { ExtractVisionDto } from './dto/extract-vision.dto';

@ApiTags('Business Cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @ApiOperation({ summary: 'Upload card image to Cloudinary storage' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Multipart upload failed: no file was supplied.');
    }
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    return {
      success: true,
      message: 'Image successfully uploaded to Cloudinary.',
      url: imageUrl,
    };
  }

  @ApiOperation({ summary: 'Create a new business card contact' })
  @Post()
  async create(
    @GetUser('id') userId: number, 
    @Body() createCardDto: CreateCardDto
  ) {
    return this.cardsService.create(userId, createCardDto);
  }

  @ApiOperation({ summary: 'Get business cards list with pagination and advanced filtering' })
  @Get()
  async findAll(
    @GetUser('id') userId: number, 
    @Query() query: QueryCardsDto
  ) {
    return this.cardsService.findAll(userId, query);
  }

  @ApiOperation({ summary: 'Export matching business cards to Microsoft Excel' })
  @Get('export')
  async export(
    @GetUser('id') userId: number, 
    @Query() query: QueryCardsDto,
    @Res() res: any
  ) {
    return this.cardsService.exportToExcel(userId, query, res);
  }

  @ApiOperation({ summary: 'Update an existing business card contact details' })
  @Put(':id')
  async update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto
  ) {
    return this.cardsService.update(userId, id, updateCardDto);
  }

  @ApiOperation({ summary: 'Delete a business card permanently' })
  @Delete(':id')
  async remove(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.cardsService.remove(userId, id);
  }

  @ApiOperation({ summary: 'Refine a raw scanned address using Gemini' })
  @Post('refine-address')
  async refineAddress(@Body() refineAddressDto: RefineAddressDto) {
    return this.cardsService.refineAddress(refineAddressDto.address);
  }

  @ApiOperation({ summary: 'Extract details from a business card image using Gemini Vision' })
  @Post('extract-vision')
  async extractVision(@Body() extractVisionDto: ExtractVisionDto) {
    return this.cardsService.extractVision(extractVisionDto.imageBase64);
  }
}
