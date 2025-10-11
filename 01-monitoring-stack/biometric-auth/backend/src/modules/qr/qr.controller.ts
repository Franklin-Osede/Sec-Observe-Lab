import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { QrService } from './';
import { QrGenerateDto, QrValidateDto } from './dto/qr.dto';

@ApiTags('QR Code')
@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate QR code' })
  @ApiResponse({ status: 200, description: 'QR code generated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async generateQrCode(@Body() dto: QrGenerateDto) {
    return this.qrService.generateQrCode(dto.username, dto.data);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate QR code' })
  @ApiResponse({ status: 200, description: 'QR code validated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async validateQrCode(@Body() dto: QrValidateDto) {
    return this.qrService.validateQrCode(dto.username, dto.qrCode);
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get QR module health status' })
  @ApiResponse({ status: 200, description: 'Health status retrieved successfully.' })
  async getHealth() {
    return this.qrService.getHealth();
  }
}