import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';

@Controller('user')
// @UseGuards(JwtGuard, RolesGuard)
// @Roles('ADMIN')
export class UserController {
    constructor(readonly userService: UserService) { }
    @Post('create')
    create(@Body() body: CreateUserDto) {
        return this.userService.createUser(
            body.email,
            body.password,
        );
    }

    @Get()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    findAll() {
        return this.userService.findAll();
    }

    @Get('me')
    @UseGuards(JwtGuard)
    getMe(@Req() req) {
        return req.user;
    }

}
