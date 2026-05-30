import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const publicUserSelect = {
    id: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UserService {
    constructor(readonly prisma: PrismaService) { }

    async createUser(email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: { email, password: hashedPassword },
            select: publicUserSelect,
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findAll() {
        return this.prisma.user.findMany({ select: publicUserSelect });
    }

    async validateUser(email: string, plainPassword: string) {
        const user = await this.findByEmail(email);

        if (!user) return null;

        const isMatch = await bcrypt.compare(plainPassword, user.password);

        if (!isMatch) return null;

        const { password, hashedRt, ...result } = user;

        return result;
    }
}
