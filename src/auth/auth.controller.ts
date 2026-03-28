import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/user.dto';

@Controller('auth')
export class AuthController {
    constructor(readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: CreateUserDto) {
        const token = await this.authService.signToken(body.email, body.password);
        return { 'Access token': token }
    }
}
