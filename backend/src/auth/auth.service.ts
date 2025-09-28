import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaClient, private jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  }

  signToken(u: { id: string; email: string; role: Role }) {
    return this.jwt.sign({ sub: u.id, email: u.email, role: u.role }, { expiresIn: '8h' });
  }

  async loginViewer(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const token = this.signToken(user);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  async loginAdmin(email: string, password: string, ip?: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      await this.prisma.loginAudit.create({
        data: { email, success: false, ip, userId: null, context: 'ADMIN' },
      });
      throw new UnauthorizedException('Invalid credentials');
    }
    
    if (!(user.role === 'CTO' || user.role === 'TECH_LEAD')) {
      await this.prisma.loginAudit.create({
        data: { email, success: false, ip, userId: user.id, context: 'ADMIN' },
      });
      throw new UnauthorizedException('Insufficient role');
    }
    await this.prisma.loginAudit.create({
      data: { email, success: true, ip, userId: user.id, context: 'ADMIN' },
    });
    const token = this.signToken(user);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}
