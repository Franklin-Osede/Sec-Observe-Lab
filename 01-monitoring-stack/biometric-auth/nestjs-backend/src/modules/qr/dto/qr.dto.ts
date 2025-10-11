import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class QrGenerateDto {
  @ApiProperty({ description: 'Username for QR generation' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Data to encode in QR code' })
  @IsString()
  @IsNotEmpty()
  data: string;
}

export class QrValidateDto {
  @ApiProperty({ description: 'Username for QR validation' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'QR code to validate' })
  @IsString()
  @IsNotEmpty()
  qrCode: string;
}
