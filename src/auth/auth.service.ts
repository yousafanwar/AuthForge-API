import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        readonly jwtService: JwtService,
        readonly userService: UserService
    ) { }

    async signToken(email: string, password: string) {

        const user = await this.userService.validateUser(email, password);

        if (!user) {
            throw new NotFoundException('User with this email was not found');
        }

        const payload = {
            sub: user.id,
            email: user.email
        }

        return this.jwtService.signAsync(payload);
    }
}
