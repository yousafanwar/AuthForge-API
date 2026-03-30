import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        readonly jwtService: JwtService,
        readonly prismaService: PrismaService,
        readonly userService: UserService
    ) { }


    async getTokens(payload: any) {

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: 'secret-key',
                expiresIn: '15m'
            }),
            this.jwtService.signAsync(payload, {
                secret: 'refresh-secret',
                expiresIn: '7d'
            }),
        ]);

        return { accessToken: at, refreshToken: rt };
    }

    async updateRefreshToken(userId: string, rt: string) {
        const rtHash = await bcrypt.hash(rt, 10);
        await this.prismaService.user.update({ where: { id: userId }, data: { hashedRt: rtHash } });
    }


    async verifyRefreshToken(rt: string) {

        const payload = await this.jwtService.verify(rt, {
            secret: 'refresh-secret',
        });

        const user = await this.prismaService.user.findUnique({ where: { id: payload.sub } });

        if (!user || !user?.hashedRt) {
            throw new UnauthorizedException();
        }

        const isMatch = await bcrypt.compare(rt, user.hashedRt);

        if (!isMatch) {
            throw new UnauthorizedException();
        }

        const newPayload = {
            sub: user.id,
            email: user.email
        };

        const tokens = await this.getTokens(newPayload);

        // update refresh token
        await this.updateRefreshToken(payload.sub, tokens.refreshToken);

        return { access_token: tokens.accessToken };
    }

    async login(email: string, password: string) {
        const user = await this.userService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email
        }

        const tokens = await this.getTokens(payload);

        await this.updateRefreshToken(user.id, tokens.refreshToken)

        return tokens;
    }

    async removeRtFromDb(userId: string) {
        await this.prismaService.user.update({ where: { id: userId }, data: { hashedRt: null } });
    }
}
