import {
  Injectable, UnauthorizedException, ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existe = await this.usuariosRepo.findOne({ where: { email: dto.email } });
    if (existe) throw new ConflictException('El email ya está registrado');

    const hash = await bcrypt.hash(dto.password, 10);
    const usuario = this.usuariosRepo.create({
      email: dto.email,
      nombre: dto.nombre,
      apellido: dto.apellido,
      passwordHash: hash,
    });
    const guardado = await this.usuariosRepo.save(usuario);
    return this.buildTokenResponse(guardado);
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuariosRepo.findOne({
      where: { email: dto.email, activo: true },
      select: ['id', 'email', 'nombre', 'apellido', 'fotoUrl', 'activo', 'passwordHash'],
    });
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const valido = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!valido) throw new UnauthorizedException('Credenciales inválidas');

    return this.buildTokenResponse(usuario);
  }

  async loginOrCreateGoogle(googleUser: {
    googleId: string;
    email: string;
    nombre: string;
    apellido: string;
    fotoUrl: string;
  }) {
    let usuario = await this.usuariosRepo.findOne({
      where: { googleId: googleUser.googleId },
    });

    if (!usuario) {
      // Buscar por email (puede que ya exista con contraseña)
      usuario = await this.usuariosRepo.findOne({ where: { email: googleUser.email } });
      if (usuario) {
        // Vincular Google al usuario existente
        usuario.googleId = googleUser.googleId;
        if (!usuario.fotoUrl) usuario.fotoUrl = googleUser.fotoUrl;
        await this.usuariosRepo.save(usuario);
      } else {
        // Crear nuevo usuario
        usuario = await this.usuariosRepo.save(
          this.usuariosRepo.create({
            email: googleUser.email,
            nombre: googleUser.nombre,
            apellido: googleUser.apellido,
            googleId: googleUser.googleId,
            fotoUrl: googleUser.fotoUrl,
          }),
        );
      }
    }

    return this.buildTokenResponse(usuario);
  }

  private buildTokenResponse(usuario: Usuario) {
    const payload: JwtPayload = { sub: usuario.id, email: usuario.email };
    return {
      accessToken: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        fotoUrl: usuario.fotoUrl,
      },
    };
  }
}
