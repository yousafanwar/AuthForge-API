import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(readonly userService: UserService) { }

    @ApiOperation({ summary: 'Register new user' })
    @Post('create')
    create(@Body() body: CreateUserDto) {
        return this.userService.createUser(
            body.email,
            body.password,
        );
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'List all users (admin only)' })
    @Get()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    findAll() {
        return this.userService.findAll();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @Get('me')
    @UseGuards(JwtGuard)
    getMe(@Req() req) {
        return req.user;
    }
}
