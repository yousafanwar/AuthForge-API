import { Body, Controller, UnauthorizedException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/user.dto';
import { JwtGuard } from './guards/jwt.guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Login user' })
    @Post('login')
    async login(@Body() body: CreateUserDto, @Res({ passthrough: true }) res) {

        const token = await this.authService.login(body.email, body.password);

        res.cookie('refresh-token', token.refreshToken, {
            httpOnly: true,
            secure: false, // it would be true in prod
            sameSite: 'lax'
        })

        return { 'Access token': token.accessToken }
    }

    @ApiCookieAuth('refresh-token')
    @ApiOperation({ summary: 'Refresh access token using refresh-token cookie' })
    @Post('refresh')
    async getNewTokens(@Req() req) {

        const rt = req.cookies['refresh-token'];

        if (!rt) throw new UnauthorizedException();

        return this.authService.verifyRefreshToken(rt);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout user and clear refresh-token cookie' })
    @Post('logout')
    @UseGuards(JwtGuard)
    async logout(@Req() req, @Res({ passthrough: true }) res) {

        const user = req.user;

        await this.authService.removeRtFromDb(user.userId);

        res.clearCookie('refresh-token');

        return { message: 'Logged out successfully' };
    }
}
