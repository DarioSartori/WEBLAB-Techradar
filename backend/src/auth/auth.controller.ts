import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  @Post('login')
  loginViewer(@Body() dto: LoginDto) {
    return this.svc.loginViewer(dto.email, dto.password);
  }

  @Post('admin/login')
  loginAdmin(@Body() dto: LoginDto, @Req() req: any) {
    const ip = req.headers['x-forwarded-for']?.toString() || req.ip;
    return this.svc.loginAdmin(dto.email, dto.password, ip);
  }
}
