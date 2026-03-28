import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { JwtGuard } from 'src/auth/Guards/jwt.guards';

@Controller('user')
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
    @UseGuards(JwtGuard)
    findAll() {
        return this.userService.findAll();
    }

}
