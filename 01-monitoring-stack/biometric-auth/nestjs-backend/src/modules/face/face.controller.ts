import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FaceService } from './face.service';

@ApiTags('face')
@Controller('face')
export class FaceController {
  constructor(private readonly faceService: FaceService) {}

  @Post('recognize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reconocimiento facial',
    description: 'Reconoce un rostro para un usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Rostro reconocido exitosamente',
  })
  async recognizeFace(@Body() body: { username: string; faceData: string }) {
    return this.faceService.recognizeFace(body.username, body.faceData);
  }
}
