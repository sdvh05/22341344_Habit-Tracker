import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.userModel.findOne({
      correo: registerDto.correo,
    });
    if (existing) throw new ConflictException('El correo ya está registrado');

    const hashed = await bcrypt.hash(registerDto.contraseña, 10);
    const created = new this.userModel({ ...registerDto, contraseña: hashed });
    const saved = await created.save();

    return this.buildToken(saved.id, saved.correo);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ correo: loginDto.correo });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const match = await bcrypt.compare(loginDto.contraseña, user.contraseña);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');

    return this.buildToken(user.id, user.correo);
  }

  private buildToken(userId: string, correo: string) {
    const payload = { sub: userId, correo };
    return { access_token: this.jwtService.sign(payload) };
  }
}
