import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'email@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'mypassword', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}