import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        readonly prisma: PrismaService, 
        readonly authService: AuthService
    ) { }

    async createUser(email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: { email, password: hashedPassword },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async validateUser(email: string, plainPassword: string) {
        const user = await this.findByEmail(email);

        if (!user) return null;

        const isMatch = await bcrypt.compare(plainPassword, user.password);

        if (!isMatch) return null;

        const { password, hashedRt, ...result } = user;

        const token = this.authService.signToken(result.id, result.email);

        return token;
    }
}
