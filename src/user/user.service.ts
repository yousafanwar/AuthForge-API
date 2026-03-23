import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(readonly prisma: PrismaService) { }

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

    async validateUser(email: string, password: string) {
        const user = await this.findByEmail(email);

        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return null;

        return user;
    }
}
