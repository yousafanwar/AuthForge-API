import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(readonly jwtService: JwtService) { }

    async signToken(userId: string, email: string) {
        const payload = {
            sub: userId,
            email
        }

        return this.jwtService.signAsync(payload);
    }
}
