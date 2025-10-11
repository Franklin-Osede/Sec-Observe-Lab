import { IsString, IsNotEmpty, MinLength, MaxLength, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class WebauthnAuthenticationBeginDto {
  @ApiProperty({
    description: 'Nombre de usuario para la autenticación WebAuthn',
    example: 'testuser',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;
}

export class WebauthnAuthenticationCompleteDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'testuser',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'ID de la credencial',
    example: 'credential-id-123',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'ID raw de la credencial',
    example: 'raw-id-123',
  })
  @IsString()
  @IsNotEmpty()
  rawId: string;

  @ApiProperty({
    description: 'Tipo de credencial',
    example: 'public-key',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Respuesta de autenticación',
    type: 'object',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle: string;
  };
}