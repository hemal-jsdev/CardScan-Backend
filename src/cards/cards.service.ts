import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { QueryCardsDto } from './dto/query-cards.dto';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

@Injectable()
export class CardsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private parseCustomFields(customFieldsStr: string): Record<string, any> {
    try {
      return JSON.parse(customFieldsStr);
    } catch {
      return {};
    }
  }

  private mapCardResponse(card: any) {
    return {
      ...card,
      customFields: this.parseCustomFields(card.customFields),
    };
  }

  async create(userId: number, dto: CreateCardDto) {
    const customFieldsStr = JSON.stringify(dto.customFields ?? {});
    
    const card = await this.prisma.businessCard.create({
      data: {
        userId,
        fullName: dto.fullName,
        jobTitle: dto.jobTitle ?? '',
        department: dto.department ?? '',
        company: dto.company ?? '',
        companyWebsite: dto.companyWebsite ?? '',
        email: dto.email ?? '',
        phoneWork: dto.phoneWork ?? '',
        phoneMobile: dto.phoneMobile ?? '',
        phoneOther: dto.phoneOther ?? '',
        address: dto.address ?? '',
        city: dto.city ?? '',
        state: dto.state ?? '',
        country: dto.country ?? '',
        postalCode: dto.postalCode ?? '',
        linkedIn: dto.linkedIn ?? '',
        twitter: dto.twitter ?? '',
        customFields: customFieldsStr,
        gstin: dto.gstin ?? '',
        isBadge: dto.isBadge ?? false,
        rawExtractedText: dto.rawExtractedText ?? '',
        frontImageUrl: dto.frontImageUrl ?? '',
        backImageUrl: dto.backImageUrl ?? '',
        confidence: dto.confidence ?? 1.0,
      },
    });

    return {
      success: true,
      message: 'Business card successfully created.',
      data: this.mapCardResponse(card),
    };
  }

  async update(userId: number, id: number, dto: UpdateCardDto) {
    const card = await this.prisma.businessCard.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!card) {
      throw new NotFoundException(`Business card with ID ${id} not found.`);
    }

    let customFieldsStr = card.customFields;
    if (dto.customFields !== undefined) {
      const existingFields = this.parseCustomFields(card.customFields);
      const mergedFields = { ...existingFields, ...dto.customFields };
      customFieldsStr = JSON.stringify(mergedFields);
    }

    const updatedCard = await this.prisma.businessCard.update({
      where: { id },
      data: {
        fullName: dto.fullName ?? card.fullName,
        jobTitle: dto.jobTitle ?? card.jobTitle,
        department: dto.department ?? card.department,
        company: dto.company ?? card.company,
        companyWebsite: dto.companyWebsite ?? card.companyWebsite,
        email: dto.email ?? card.email,
        phoneWork: dto.phoneWork ?? card.phoneWork,
        phoneMobile: dto.phoneMobile ?? card.phoneMobile,
        phoneOther: dto.phoneOther ?? card.phoneOther,
        address: dto.address ?? card.address,
        city: dto.city ?? card.city,
        state: dto.state ?? card.state,
        country: dto.country ?? card.country,
        postalCode: dto.postalCode ?? card.postalCode,
        linkedIn: dto.linkedIn ?? card.linkedIn,
        twitter: dto.twitter ?? card.twitter,
        customFields: customFieldsStr,
        gstin: dto.gstin ?? card.gstin,
        isBadge: dto.isBadge ?? card.isBadge,
        rawExtractedText: dto.rawExtractedText ?? card.rawExtractedText,
        frontImageUrl: dto.frontImageUrl ?? card.frontImageUrl,
        backImageUrl: dto.backImageUrl ?? card.backImageUrl,
        confidence: dto.confidence ?? card.confidence,
      },
    });

    return {
      success: true,
      message: 'Business card successfully updated.',
      data: this.mapCardResponse(updatedCard),
    };
  }

  async remove(userId: number, id: number) {
    const card = await this.prisma.businessCard.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!card) {
      throw new NotFoundException(`Business card with ID ${id} not found.`);
    }

    // Hard delete from database
    await this.prisma.businessCard.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Business card successfully deleted.',
      deletedCardId: id,
    };
  }

  private buildWhereClause(userId: number, query: QueryCardsDto) {
    const where: any = { userId, deletedAt: null };

    // Search query: fuzzy matches across fullName, company, email, jobTitle
    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { company: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { jobTitle: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Low confidence filter (< 50%)
    if (query.lowConfidence) {
      where.confidence = { lt: 0.5 };
    }

    // Has GSTIN filter
    if (query.hasGstin) {
      where.gstin = { not: '' };
    }

    // Missing contact details filter (email,phone)
    if (query.missingContact) {
      const missingFields = query.missingContact.split(',').map(f => f.trim().toLowerCase());
      const missingConditions: any[] = [];
      if (missingFields.includes('email')) {
        missingConditions.push({ email: '' });
      }
      if (missingFields.includes('phone')) {
        missingConditions.push({ phoneMobile: '' }, { phoneWork: '' });
      }
      if (missingConditions.length > 0) {
        // If an existing OR filter is present, combine it
        if (where.OR) {
          where.AND = [
            { OR: where.OR },
            { OR: missingConditions }
          ];
          delete where.OR;
        } else {
          where.OR = missingConditions;
        }
      }
    }

    // Has social link filter
    if (query.hasSocial) {
      const socialConditions = [
        { linkedIn: { not: '' } },
        { twitter: { not: '' } }
      ];
      if (where.OR) {
        if (where.AND) {
          where.AND.push({ OR: socialConditions });
        } else {
          where.AND = [
            { OR: where.OR },
            { OR: socialConditions }
          ];
          delete where.OR;
        }
      } else {
        where.OR = socialConditions;
      }
    }

    // Badge filter
    if (query.isBadge !== undefined) {
      where.isBadge = query.isBadge;
    }

    return where;
  }

  async findAll(userId: number, query: QueryCardsDto) {
    const where = this.buildWhereClause(userId, query);

    // Sorting
    const orderByMap: Record<string, string> = {
      date: 'createdAt',
      name: 'fullName',
      company: 'company',
      confidence: 'confidence',
    };
    const sortField = orderByMap[query.sortBy ?? 'date'] ?? 'createdAt';
    const orderBy = { [sortField]: query.sortOrder ?? 'desc' };

    // Pagination
    const skip = ((query.page ?? 1) - 1) * (query.limit ?? 20);
    const take = query.limit ?? 20;

    const [totalCount, cards] = await Promise.all([
      this.prisma.businessCard.count({ where }),
      this.prisma.businessCard.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    return {
      success: true,
      message: 'Business cards successfully retrieved.',
      pagination: {
        currentPage: query.page ?? 1,
        pageSize: take,
        totalPages,
        totalCount,
      },
      data: cards.map(card => this.mapCardResponse(card)),
    };
  }

  async exportToExcel(userId: number, query: QueryCardsDto, response: Response) {
    const where = this.buildWhereClause(userId, query);

    // Get all matching records (no pagination)
    const cards = await this.prisma.businessCard.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Business Cards');

    // Define column headers and sizes
    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 22 },
      { header: 'Job Title', key: 'jobTitle', width: 20 },
      { header: 'Department', key: 'department', width: 18 },
      { header: 'Company', key: 'company', width: 22 },
      { header: 'Company Website', key: 'companyWebsite', width: 25 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Mobile Phone', key: 'phoneMobile', width: 16 },
      { header: 'Work Phone', key: 'phoneWork', width: 16 },
      { header: 'Other Phone', key: 'phoneOther', width: 16 },
      { header: 'Full Address', key: 'address', width: 30 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'Country', key: 'country', width: 15 },
      { header: 'Postal Code', key: 'postalCode', width: 12 },
      { header: 'LinkedIn Profile', key: 'linkedIn', width: 25 },
      { header: 'Twitter Profile', key: 'twitter', width: 20 },
      { header: 'GSTIN Number', key: 'gstin', width: 18 },
      { header: 'Private QR Badge?', key: 'isBadge', width: 20 },
      { header: 'OCR Confidence %', key: 'confidence', width: 18 },
      { header: 'Extracted Text', key: 'rawText', width: 35 },
      { header: 'Front Image Link', key: 'frontImage', width: 25 },
      { header: 'Tags', key: 'tags', width: 20 },
      { header: 'Created Date', key: 'createdAt', width: 20 },
    ];

    // Populate rows
    cards.forEach(card => {
      const parsedFields = this.parseCustomFields(card.customFields);
      let customFieldsText = '';
      Object.entries(parsedFields).forEach(([k, v]) => {
        customFieldsText += `${k}: ${v}\n`;
      });

      const confidenceFormatted = `${(card.confidence * 100).toFixed(1)}%`;
      const createdDateFormatted = new Date(card.createdAt).toISOString().replace('T', ' ').substring(0, 16);

      worksheet.addRow({
        fullName: card.fullName,
        jobTitle: card.jobTitle,
        department: card.department,
        company: card.company,
        companyWebsite: card.companyWebsite,
        email: card.email,
        phoneMobile: card.phoneMobile,
        phoneWork: card.phoneWork,
        phoneOther: card.phoneOther,
        address: card.address,
        city: card.city,
        state: card.state,
        country: card.country,
        postalCode: card.postalCode,
        linkedIn: card.linkedIn,
        twitter: card.twitter,
        gstin: card.gstin ? card.gstin.toUpperCase() : '',
        isBadge: card.isBadge ? 'YES' : 'NO',
        confidence: confidenceFormatted,
        rawText: card.rawExtractedText || customFieldsText.trim(),
        frontImage: card.frontImageUrl,
        tags: card.tags,
        createdAt: createdDateFormatted,
      });
    });

    // Style Header Row
    const headerRow = worksheet.getRow(1);
    headerRow.height = 26;
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' }, // Premium Deep Navy Blue
    };

    // Freeze header row so scrolling keeps column titles visible
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    // Auto-fit column widths based on content size
    if (worksheet.columns) {
      worksheet.columns.forEach(column => {
        if (!column) return;
        const col = column as ExcelJS.Column;
        let maxLength = 0;
        col.eachCell({ includeEmpty: true }, cell => {
          const valueStr = cell.value ? cell.value.toString() : '';
          const lines = valueStr.split('\n');
          lines.forEach(line => {
            if (line.length > maxLength) {
              maxLength = line.length;
            }
          });
        });
        // Set reasonable bound bounds (min 10, max 50)
        col.width = Math.max(Math.min(maxLength + 4, 50), 10);
      });
    }

    // Style data cells
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip headers
      
      row.height = 22;
      row.alignment = { vertical: 'middle' };
      
      // Apply borders
      row.eachCell((cell) => {
        cell.font = { name: 'Calibri', size: 10 };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          right: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        };
      });
    });

    // Set streaming parameters
    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=cardscan_export_${Date.now()}.xlsx`,
    );
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Pragma', 'no-cache');

    await workbook.xlsx.write(response);
    response.end();
  }

  async refineAddress(rawAddress: string) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new BadRequestException('Gemini API key is not configured on the server.');
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Parse the following address into its components. Clean up any scanning typos: ${rawAddress}`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'OBJECT',
                properties: {
                  city: { type: 'STRING', description: 'Name of the city, town or locality' },
                  state: { type: 'STRING', description: 'Name of the state, province or region' },
                  country: { type: 'STRING', description: 'Full name of the country' },
                  postalCode: { type: 'STRING', description: 'ZIP or postal code if present' },
                },
                required: ['city', 'state', 'country'],
              },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const responseData: any = await response.json();
      const text = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Invalid response structure from Gemini API');
      }

      return JSON.parse(text);
    } catch (error) {
      throw new BadRequestException(`Address refinement failed: ${error.message}`);
    }
  }

  async extractVision(imageBase64: string) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new BadRequestException('Gemini API key is not configured on the server.');
    }

    let mimeType = 'image/jpeg';
    let data = imageBase64;
    if (imageBase64.startsWith('data:')) {
      const parts = imageBase64.split(';base64,');
      if (parts.length === 2) {
        mimeType = parts[0].replace('data:', '');
        data = parts[1];
      }
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze this business card image and extract all contact details. Return values as empty strings if they are not found. Return a confidence score between 0.0 and 1.0 reflecting how clear the text was. Output MUST be valid JSON matching the schema.`,
                  },
                  {
                    inlineData: {
                      mimeType,
                      data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'OBJECT',
                properties: {
                  fullName: { type: 'STRING', description: 'The full name of the contact person.' },
                  jobTitle: { type: 'STRING', description: 'The title or role of the person.' },
                  department: { type: 'STRING', description: 'The department (e.g. Sales, Engineering).' },
                  company: { type: 'STRING', description: 'The company name.' },
                  companyWebsite: { type: 'STRING', description: 'The website address.' },
                  email: { type: 'STRING', description: 'The email address.' },
                  phoneWork: { type: 'STRING', description: 'The work phone number.' },
                  phoneMobile: { type: 'STRING', description: 'The mobile/cell phone number.' },
                  phoneOther: { type: 'STRING', description: 'Any other phone numbers listed.' },
                  address: { type: 'STRING', description: 'The street address.' },
                  city: { type: 'STRING', description: 'The city.' },
                  state: { type: 'STRING', description: 'The state or province.' },
                  country: { type: 'STRING', description: 'The country.' },
                  postalCode: { type: 'STRING', description: 'The ZIP/postal code.' },
                  linkedIn: { type: 'STRING', description: 'The LinkedIn profile URL or username.' },
                  twitter: { type: 'STRING', description: 'The Twitter/X profile URL or username.' },
                  gstin: { type: 'STRING', description: 'The GSTIN number if present (India Tax ID, starts with two digits followed by PAN).' },
                  rawExtractedText: { type: 'STRING', description: 'Clean concatenation of all text found on the card.' },
                  confidence: { type: 'NUMBER', description: 'Confidence score between 0.0 and 1.0.' }
                },
                required: ['fullName', 'company', 'email', 'phoneMobile', 'confidence'],
              },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const responseData: any = await response.json();
      const text = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Invalid response structure from Gemini API');
      }

      const result = JSON.parse(text);
      return {
        success: true,
        message: 'AI Card extraction successful',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(`AI extraction failed: ${error.message}`);
    }
  }
}

